from flask import Flask
from flask import request
import json
import util
app = Flask(__name__)


'''
[GET]
'''
@app.route('/')
def map_route():
    return app.send_static_file('index.html')


'''
Pickups near each other ordered by weight

[POST]
Headers
   Content-Type: application/json

Request [JSON]
{
   "polygon": [{"lat": lat, "lng": lng}, {"lat": lat, "lng": lng}...]
}

Response SUCCESS 200 (application/json)
{
   "pickups": [{"lat": lat, "lng": lng, "weight": count},
               {"lat": lat, "lng": lng, "weight": count}...]
}
'''
@app.route('/api/pickups', methods=["POST"])
def pickups_url():
    # validate
    data = request.get_json()
    if data is None:
        return "Client Error: Bad JSON", 400
    if 'polygon' not in data or type(data['polygon']) is not list:
        return "Client Error: Malformed JSON", 400

    # first point and last point must be the same
    if data['polygon'][0] != data['polygon'][-1]:
        data['polygon'].append(data['polygon'][0])

    return json.dumps(util.get_pickups(data['polygon'])), 200


'''
Dropoffs near each other ordered by weight

[POST]
Headers
   Content-Type: application/json

Request [JSON]
{
   "polygon": [{"lat": lat, "lng": lng}, {"lat": lat, "lng": lng}...]
}

Response SUCCESS 200 (application/json)
{
   "dropoffs": [{"lat": lat, "lng": lng, "weight": count},
                {"lat": lat, "lng": lng, "weight": count}...]
}
'''
@app.route('/api/dropoffs', methods=["POST"])
def dropoffs_url():
    # validate
    data = request.get_json()
    if data is None:
        return "Client Error: Bad JSON", 400
    if 'polygon' not in data or type(data['polygon']) is not list:
        return "Client Error: Malformed JSON", 400

    # first point and last point must be the same
    if data['polygon'][0] != data['polygon'][-1]:
        data['polygon'].append(data['polygon'][0])

    return json.dumps(util.get_dropoffs(data['polygon'])), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
