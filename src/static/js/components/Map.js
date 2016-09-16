var React = require('react');
var ActionCreator = require('../ActionCreator');
var Store = require('../Store');


var Map = React.createClass({

  getInitialState: function() {
  return {};
  },

  initalizeMap: function(){

    // create map
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.71478, lng: -74.0701615},
      zoom: 10
    });

    // create default polygon
    var ppoints = Store.getDefaultPolygonPoints();
    var polygon = new google.maps.Polygon({
        paths: ppoints,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.05,
        editable: true,
     });

    polygon.setMap(map)
    
    //get default pickup points
    ActionCreator.requestPickups(polygon.getPath().getArray());

    // set up change listners for when polygon is edited 
    polygon.getPaths().forEach(function(path, index){
      google.maps.event.addListener(path, 'insert_at', function(){
        ActionCreator.addPolyPin(path.getArray());
      });

      google.maps.event.addListener(path, 'set_at', function(){
        ActionCreator.addPolyPin(path.getArray());
      });
    });

    // send map to the store
    ActionCreator.createMap(map);
  },

  componentDidMount: function() {
   this.initalizeMap();
  },

  render(){
    return (
      <div id="map"></div>
    );
  }
});

module.exports = Map;