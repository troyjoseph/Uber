import psycopg2
import json

# smaller cluster size improve performance
# largest cluster size may create more realistic groupings
CLUSTER_SIZE = 0.00005  # degrees


'''
flattens pickup/dropoff and weight to single dictionary

params:
pd: {'coordinates': (lat, lng)}
weight: integer

returns:
{'lat': lat, 'lng': lng,'weight': weight}
'''
def flatten_pd(pd, weight):
    return {'lat': pd['coordinates'][0],
            'lng': pd['coordinates'][1],
            'weight': weight}


'''
queries data bases for top pickups inside given polygon

params:
polygon: [{'lat': lat, 'lng': lng}, {'lat': lat, 'lng': lng}...]

returns:
  [{'lat': lat, 'lng': lng,'weight': weight},
   {'lat': lat, 'lng': lng,'weight': weight}...]]
   where elements are ordered by descending weight.
'''
def get_pickups(polygon):
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()

    # validate data so we don't have sql injections
    for latlon in polygon:
        try:
            float(latlon['lat'])
            float(latlon['lng'])
        except ValueError:
            return []

    # build formatted string now that we have validated input
    poly_string = ""
    for latlon in polygon:
        poly_string += str(latlon['lat']) + " " + str(latlon['lng']) + ", "

    query = """
                SELECT
                    ST_AsGeoJSON(ST_AsText(ST_GeometryN(unnest(t.pickup_cluster), 1)))   as pickups
                  , ST_NumGeometries(unnest(t.pickup_cluster))                           as num_pickups
                FROM (
                  SELECT
                      ST_ClusterWithin(ul.pickup_ll, %s) as pickup_cluster
                  FROM
                    uber_trip_locations as ul
                  WHERE
                    ST_Within(pickup_ll, ST_GeometryFromText ('POLYGON((""" + str(poly_string)[:-2] + """))', -1))
                  LIMIT
                    100
                ) as t
                order by num_pickups desc;
            """
    cur.execute(query, (CLUSTER_SIZE,))
    data = cur.fetchall()
    cur.close()
    conn.close()

    # format output data
    r = {'pickups': []}
    for row in data:
        pickup = json.loads(row[0])
        weight = row[1]
        r['pickups'].append(flatten_pd(pickup, weight))
    return r


'''
queries data bases for top pickups inside given polygon

params:
polygon: [{'lat': lat, 'lng': lng}, {'lat': lat, 'lng': lng}...]

returns:
  [{'lat': lat, 'lng': lng,'weight': weight},
   {'lat': lat, 'lng': lng,'weight': weight}...]]
   where elements are ordered by descending weight.
'''
def get_dropoffs(polygon):
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()

    # validate data so we don't have sql injections
    for latlon in polygon:
        try:
            float(latlon['lat'])
            float(latlon['lng'])
        except ValueError:
            return []

    # build formatted string now that we have validated input
    poly_string = ""
    for latlon in polygon:
        poly_string += str(latlon['lat']) + " " + str(latlon['lng']) + ", "

    query = """
                SELECT
                    ST_AsGeoJSON(ST_AsText(ST_GeometryN(unnest(t.dropoff_cluster), 1)))   as dropoff
                  , ST_NumGeometries(unnest(t.dropoff_cluster))                           as num_dropoff
                FROM (
                  SELECT
                      ST_ClusterWithin(ul.dropoff_ll, %s) as dropoff_cluster
                  FROM
                    uber_trip_locations as ul
                  WHERE
                    ST_Within(dropoff_ll, ST_GeometryFromText ('POLYGON((""" + str(poly_string)[:-2] + """))', -1))
                ) as t
                order by num_dropoff desc;
            """
    cur.execute(query, (CLUSTER_SIZE,))
    data = cur.fetchall()

    cur.close()
    conn.close()

    r = {'dropoffs': []}
    for row in data:
        pickup = json.loads(row[0])
        weight = row[1]
        r['dropoffs'].append(flatten_pd(pickup, weight))
    return r
