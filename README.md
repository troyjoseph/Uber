# Uber Visualizer


## Demo
Demo active as of 9/16/2016:

[http://192.241.181.133/](http://192.241.181.133/#)

## Installation
Installation takes place in several steps. First, clone the repo.

```
git clone http://github.com/troyjoseph/Uber.git
git submodule init
git submodule update
````
### Python
Next, install Python dependencies.

cd into repo

```
cd Uber
```
Create and use virtualenv.

```
virtualenv venv
source venv/bin/activate
```

Install dependencies.

```
pip install -r requirements.txt
```

### Database
The app is backed by a Postgres database running Postgis.

- To install Postgres on Ubuntu, see [this link](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04).

- To create at Postgis datebase see [this link](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04).

- To create our table, run the following command in the Postgis database:

```
CREATE SEQUENCE id_seq;
CREATE TABLE uber_trip_locations ( id INTEGER NOT NULL DEFAULT nextval('id_seq'), time TIMESTAMP NOT NULL);
SELECT AddGeometryColumn('uber_trip_locations','pickup_ll',-1,'POINT',2);
SELECT AddGeometryColumn('uber_trip_locations','dropoff_ll',-1,'POINT',2);
```

- Next, create a user to access the database. Grant permission to that user.

```
CREATE USER uber
GRANT ALL PRIVILEGES ON uber_trip_locations TO uber
```

- Import data into the database.

```
cd src
python create_db.py

```

## Use
After completing the above steps, run the sever.

```
python server.py
```

The app will run on http://0.0.0.0:5000



## Design designs

This app was designed to be  easy to use and present accurate data. On the front end there are few controls. Users can drag the polygon to their preferred shape or choose between pickups and dropoffs. The rest of the app reacts dynamically to these decisions to present the requested information with a heat map, top ten pins, and large text on the right side of the screen.

To support extremely fast data aggregation, the app utilizes a Postgis spatial database. This optimizes the collection of data from within a bounded region, enabling the user to quickly change the polygon as he or she wants. Postgis also supports other important features like clustering to help determine top ten locations.

Other technology that was used in this app includes:
- Python/flask: makes API development fast and easy.
- Google Maps: APIv3 provides awesome support for dynamic maps and ability to draw and edit polygons, create pins, and make heat maps.
- React.JS / Flux: While react isn't  necessary for this project, when combined with Flux, it's a great framework that keeps the flow of data clear. It also makes it easy to scale and extend the app in the future.

## Future work
This project was created in about a day so there are many cool features and enhancements that could be added.
- For this project to scale to consumers, the heat map generation would need to be much faster. It works fine on small regions, but struggles when expanded to large areas. Collecting the datapoints within the polygon bounds happens quickly, but creating the pins with the clustering algorithm "ST_ClusterWithin" is very slow. It runs faster when the maximum size cluster is smaller, but this sometimes cause several pins to be created instead of grouped together. Some simple ways to improve the speed of this would be to use a LIMIT function with a subquery that is used to compute the clusters. This way we could compute the clusters on smaller portions of the dataset rather than the whole thing. This solution would run faster, but might not be as accurate. Another solution would be to request the top ten pins ayncronously from the other datapoints and only display them once they have been received and the map has stabilized. 
- There's several small UI changes that could be made. On the maps, it would be great to use a Fusion Table instead of a heatmap. Fusion Tables renders on Google's severs instead of in the browser. The heat maps don't slow down the browser too much on a laptop, but if a mobile version of this app was created, it might be slow to render the heat map. 
- Vertices can't be deleted from polygons. This was an intention decision to make the UI simple, but some users might prefer deleting instead of refreshing. 
- The pickup/dropoff datasets are far too similar. Since they are points from the same set, this is not that surprising.
- It would be cool to display a few of the most common routes between pick up and drop off. It's a little tricky to do this with Map APIV3 because direction services are very limited.


