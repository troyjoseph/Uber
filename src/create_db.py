import os
import psycopg2
from dateutil import parser




FILENAME = os.path.join('..', 'data', 'uber-tlc-foil-response', 'uber-trip-data', 'uber-raw-data-apr14NO.csv')


# TODO: Error handling for bad connection
# TODO: recreate table if it exists
def create_db():
    conn = psycopg2.connect("dbname=postgis user=postgres")
    cur = conn.cursor()
    cur.execute("""
                     CREATE SEQUENCE id_seq;
                     CREATE TABLE uber_trip_locations ( id INTEGER NOT NULL DEFAULT nextval('id_seq')
                                                        , time TIMESTAMP NOT NULL);
                     SELECT AddGeometryColumn('uber_trip_locations','pickup_ll',-1,'POINT',2);
                     SELECT AddGeometryColumn('uber_trip_locations','dropoff_ll',-1,'POINT',2);
                """)
    conn.commit()
    cur.close()
    conn.close()
    """
    CREATE USER uber
    GRANT ALL PRIVILEGES ON uber_trip_locations TO uber


    """


    

# TODO: Error handling for bad connection
def import_data():
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()
    lines = None

    # TODO error handling for bad file name
    # TODO use all files
    with open(FILENAME) as f:
        lines = f.readlines()

    lines.pop(0)
    for i in range(0, len(lines) -1, 2):
        print "\rProcessing row {} of {}".format(i, len(lines)), 
        pickup = lines[i].split(",")
        dropoff = lines[i + 1].split(",")
        time = parser.parse(pickup[0], fuzzy=True)  # use pickup time for route time
        pickup_lat = pickup[1]
        pickup_lon = pickup[2]
        dropoff_lat = dropoff[1]
        dropoff_lon = dropoff[2]
        cur.execute("""
                        INSERT INTO 
                          uber_trip_locations(time, pickup_ll, dropoff_ll) 
                        VALUES 
                            (%s
                          , ST_GeomFromText('Point(%s %s)', -1)
                          , ST_GeomFromText('Point(%s %s)', -1)
                            );
                    """,(time, float(pickup_lat), float(pickup_lon), float(dropoff_lat), float(dropoff_lon)))   
        conn.commit()

    cur.close()
    conn.close()


if __name__ == "__main__":
    # create_db()
    import_data()