var React = require('react');
var ActionCreator = require('../actions/ActionCreator');
var Store = require('../stores/Store');
var MapUtils = require('../utils/MapUtils');


var Map = React.createClass({

	getInitialState: function() {
	//return getStateFromStore();
		return {};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._onChange);

		var map = new google.maps.Map(document.getElementById('map'), {
		      center: {lat: 40.71478, lng: -74.0701615},
		      zoom: 10
		});

		// Adding a marker to the location we are showing
		google.maps.event.addListener(map, "dblclick", function (event) { 
            ActionCreator.createPolyPin(event.latLng);
        });
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
        ActionCreator.requestPickups(polygon.getPath().getArray());

        polygon.getPaths().forEach(function(path, index){

		  google.maps.event.addListener(path, 'insert_at', function(){
		      ActionCreator.requestPickups(path.getArray());
		  });

		  google.maps.event.addListener(path, 'remove_at', function(){
		    // Point was removed
		  });

		  google.maps.event.addListener(path, 'set_at', function(){
		      ActionCreator.requestPickups(path.getArray());
		  });

		});


/*

var deleteMenu = new DeleteMenu();

        google.maps.event.addListener(flightPath, 'rightclick', function(e) {
          // Check if click was on a vertex control point
          if (e.vertex == undefined) {
            return;
          }
          deleteMenu.open(map, flightPath.getPath(), e.vertex);
        });
      }

      function DeleteMenu() {
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        this.div_.innerHTML = 'Delete';

        var menu = this;
        google.maps.event.addDomListener(this.div_, 'click', function() {
          menu.removeVertex();
        });
      }
      DeleteMenu.prototype = new google.maps.OverlayView();

      DeleteMenu.prototype.onAdd = function() {
        var deleteMenu = this;
        var map = this.getMap();
        this.getPanes().floatPane.appendChild(this.div_);

        // mousedown anywhere on the map except on the menu div will close the
        // menu.
        this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function(e) {
          if (e.target != deleteMenu.div_) {
            deleteMenu.close();
          }
        }, true);
      };

      DeleteMenu.prototype.onRemove = function() {
        google.maps.event.removeListener(this.divListener_);
        this.div_.parentNode.removeChild(this.div_);

        // clean up
        this.set('position');
        this.set('path');
        this.set('vertex');
      };

      DeleteMenu.prototype.close = function() {
        this.setMap(null);
      };

      DeleteMenu.prototype.draw = function() {
        var position = this.get('position');
        var projection = this.getProjection();

        if (!position || !projection) {
          return;
        }

        var point = projection.fromLatLngToDivPixel(position);
        this.div_.style.top = point.y + 'px';
        this.div_.style.left = point.x + 'px';
      };


      DeleteMenu.prototype.open = function(map, path, vertex) {
        this.set('position', path.getAt(vertex));
        this.set('path', path);
        this.set('vertex', vertex);
        this.setMap(map);
        this.draw();
      };
	
      DeleteMenu.prototype.removeVertex = function() {
        var path = this.get('path');
        var vertex = this.get('vertex');

        if (!path || vertex == undefined) {
          this.close();
          return;
        }

        path.removeAt(vertex);
        this.close();
      };



*/



		ActionCreator.createMap(map);

	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		//this.setState(getStateFromStore());
	},
	

	render(){

		return (
				<div id="map"></div>

		);
	}

});

module.exports = Map;