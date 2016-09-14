import psycopg2
from flask import Flask
from flask import request
import json
import util
app = Flask(__name__)


def format_pd(pd, weight):
    return {'lat': pd['coordinates'][0],'lng': pd['coordinates'][1], 'weight': weight}

@app.route('/')
def map_route():
    return app.send_static_file('index.html')


# d = [[lat, lon], [lat, lon], [lat, lon]...]
def get_pickups(d):
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()

    # TODO: NOOOO SQL injections aahhhhhhhh
    poly_string = ""
    for latlon in d:
        poly_string += str(latlon['lat']) + " " + str(latlon['lng']) + ", "

    query = """
                SELECT
                    ST_AsGeoJSON(ST_AsText(ST_GeometryN(unnest(t.pickup_cluster), 1)))   as pickups
                  , ST_NumGeometries(unnest(t.pickup_cluster))                           as num_pickups
                FROM (
                  SELECT
                      ST_ClusterWithin(ul.pickup_ll, 0.00001) as pickup_cluster
                  FROM
                    uber_trip_locations as ul
                  WHERE
                    ST_Within(pickup_ll, ST_GeometryFromText ('POLYGON((""" + str(poly_string)[:-2] + """))', -1))
                  LIMIT
                    100
                ) as t
                order by num_pickups desc;
            """
    cur.execute(query)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return data


def get_dropoffs(d):
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()

    # TODO: NOOOO SQL injections aahhhhhhhh
    poly_string = ""
    for latlon in d:
        poly_string += str(latlon['lat']) + " " + str(latlon['lng']) + ", "

    query = """
                SELECT
                    ST_AsGeoJSON(ST_AsText(ST_GeometryN(unnest(t.dropoff_cluster), 1)))   as dropoff
                  , ST_NumGeometries(unnest(t.dropoff_cluster))                           as num_dropoff
                FROM (
                  SELECT
                      ST_ClusterWithin(ul.dropoff_ll, 0.00001) as dropoff_cluster
                  FROM
                    uber_trip_locations as ul
                  WHERE
                    ST_Within(dropoff_ll, ST_GeometryFromText ('POLYGON((""" + str(poly_string)[:-2] + """))', -1))
                ) as t
                order by num_dropoff desc;
            """
    cur.execute(query)
    data = cur.fetchall()

    cur.close()
    conn.close()
    return data

'''
def get_pickup_count(d):
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()

    # TODO: NOOOO SQL injections aahhhhhhhh
    poly_string = ""
    for latlon in d:
        poly_string += str(latlon['lat']) + " " + str(latlon['lng']) + ", "

    query = """
            SELECT
                COUNT(*)
            FROM
              uber_trip_locations
            WHERE
              ST_Within(pickup_ll, ST_GeometryFromText ('POLYGON((""" + str(poly_string)[:-2] + """))', -1))
            """
    cur.execute(query)
    data = cur.fetchall()

    cur.close()
    conn.close()
    return data


def get_dropoff_count(d):
    conn = psycopg2.connect("dbname=postgis user=troy")
    cur = conn.cursor()

    # TODO: NOOOO SQL injections aahhhhhhhh
    poly_string = ""
    for latlon in d:
        poly_string += str(latlon['lat']) + " " + str(latlon['lng']) + ", "

    query = """
            SELECT
                COUNT(*)
            FROM
              uber_trip_locations
            WHERE
              ST_Within(dropoff_ll, ST_GeometryFromText ('POLYGON((""" + str(poly_string)[:-2] + """))', -1))
            """
    cur.execute(query)
    data = cur.fetchall()

    cur.close()
    conn.close()
    return data
'''


# Json
# {
#   polygon: [[lat, lon], [lat, lon], [lat, lon]...]
#  }
#
@app.route('/api/pickups', methods=["POST"])
def pickups_url():
    # validate
    data = request.get_json()
    if data is None:
        return "Bad JSON", 400
    if 'polygon' not in data or type(data['polygon']) is not list:
        return "Malformed JSON", 400

    # first point and last point must be the same
    if data['polygon'][0] != data['polygon'][-1]:
        data['polygon'].append(data['polygon'][0])

    p = get_pickups(data['polygon'])

    # format output data
    d = {'pickups': []}
    for row in p:
        pickup = json.loads(row[0])
        weight = row[1]
        d['pickups'].append(format_pd(pickup, weight))

    return json.dumps(d), 200


@app.route('/api/dropoffs', methods=["POST"])
def dropoffs_url():
    # validate
    data = request.get_json()
    if data is None:
        return "Bad JSON", 400
    if 'polygon' not in data or type(data['polygon']) is not list:
        return "Malformed JSON", 400

    # first point and last point must be the same
    if data['polygon'][0] != data['polygon'][-1]:
        data['polygon'].append(data['polygon'][0])

    p = get_dropoffs(data['polygon'])

    # format output data
    d = {'dropoffs': []}
    for row in p:
        pickup = json.loads(row[0])
        weight = row[1]
        d['dropoffs'].append(format_pd(pickup, weight))

    return json.dumps(d), 200


'''
@app.route('/api/pickup_count', methods=["POST"])
def pickup_count_url():
    # validate
    data = request.get_json()
    if data is None:
        return "Bad JSON", 400
    if 'polygon' not in data or type(data['polygon']) is not list:
        return "Malformed JSON", 400

    # first point and last point must be the same
    if data['polygon'][0] != data['polygon'][-1]:
        data['polygon'].append(data['polygon'][0])

    data = get_pickup_count(data['polygon'])

    return json.dumps({'pickup_count': data}), 200


@app.route('/api/dropoff_count', methods=["POST"])
def dropoff_count_url():
    # validate
    data = request.get_json()
    if data is None:
        return "Bad JSON", 400
    if 'polygon' not in data or type(data['polygon']) is not list:
        return "Malformed JSON", 400

    # first point and last point must be the same
    if data['polygon'][0] != data['polygon'][-1]:
        data['polygon'].append(data['polygon'][0])

    data = get_dropoff_count(data['polygon'])

    return json.dumps({'dropoff_count': data}), 200
'''


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
