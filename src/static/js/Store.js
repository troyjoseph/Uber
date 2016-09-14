"use strict";

var Dispatcher = require('../Dispatcher');
var ActionTypes = require('../Constants').ActionTypes;
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
EventEmitter.prototype.setMaxListeners(0);
var CHANGE_EVENT = 'change';

var ActionCreator = require('../ActionCreator');
var MapUtils = require('../MapUtils');
var GetApi = require('../GetApi');


var active_markers = [];
var active_heatmap_data = [];
var info_windows = [];
var polygon_points = [{lat: 40.71230, lng: -73.97870}, {lat: 40.71230, lng: -73.99870}, {lat: 40.73230, lng: -73.99870}, {lat: 40.73230, lng: -73.97870}];
var polygon = null;
var map = null;
var heatmap = null;
var pdCount = 0;
var pickupActive = true;

/*
 *  Util
 */
function _clear_map(){
    pdCount = 0;
    info_windows.forEach(function(info){info.setMap(null)});
    info_windows = [];
    active_markers.forEach(function(marker){marker.setMap(null);});
    active_markers = [];
    if (heatmap != null) {
        heatmap.setMap(null);
        active_heatmap_data = [];
    }
}

function _createPin(latlng, content){
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
    });
    if (content != null){
        var info_window = new google.maps.InfoWindow({
            content: content
        });

        marker.addListener('click', function() {
            info_windows.forEach(function(info){info.close()});
            info_window.open(map, marker);

        });
        info_windows.push(info_window);

    }
    active_markers.push(marker);
}

function _createMap(m){
  map = m;
}


function _createPolygon(p){
    polygon = p;
  
  if (map == null)
    console.log("Map is null!!!");
  polygon.setMap(map);
}



/*
 *  Main functions
 */

function _activatePickup(){
    _request_pickups();
}

function _activateDropoff(){
    _request_dropoff();

}

function _show_pickups_dropoff(latlngs){
    _clear_map();
    latlngs.forEach(function(latlng, index){
        if (index < 10)
            _createPin(latlng, "Top pickup #" + (index+1) );
        pdCount += latlng.weight;
        active_heatmap_data.push({location: new google.maps.LatLng(latlng.lat, latlng.lng), weight: latlng.weight});
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: active_heatmap_data,
        map: map
    });
}

function _show_pickups(latlngs){
    pickupActive = true;
    _show_pickups_dropoff(latlngs);
}

function _show_dropoff(latlngs){
    pickupActive = false;
    _show_pickups_dropoff(latlngs);
}


function _request_pickups(mcarray){
    if (mcarray != null) 
        polygon_points = mcarray;
    GetApi.requestPickups({polygon: polygon_points}); 

}
function _request_dropoff(mcarray){
    if (mcarray != null) 
        polygon_points = mcarray;
    GetApi.requestDropoffs({polygon: polygon_points});
}

/**
 * @module stores/Store
 */
var Store = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getMap: function() {
    if (map == null){
        console.log("Error map not initialized!!")
    }
    return map;
  },

  getDefaultPolygonPoints: function(){
    return [{lat: 40.71230, lng: -73.97870}, {lat: 40.71230, lng: -73.99870}, {lat: 40.73230, lng: -73.99870}, {lat: 40.73230, lng: -73.97870}];
  },

  getPickupDropOffState: function() {
    return {pickupActive: pickupActive, count: pdCount};
  },


 });

Store.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.CREATE_PIN:
      _createPin(action.latlng);
      Store.emitChange();
      break;

    case ActionTypes.CREATE_POLY_PIN:
      _addPolyPin(action.latlng);
      Store.emitChange();
      break;

    case ActionTypes.CREATE_MAP:
      _createMap(action.map);
      Store.emitChange();
      break;

    case ActionTypes.RECEIVE_PICKUPS:
      _show_pickups(action.pickups);
      Store.emitChange();
      break;

    case ActionTypes.RECEIVE_DROPOFFS:
      _show_dropoff(action.dropoffs);
      Store.emitChange();
      break;

    case ActionTypes.REQUEST_PICKUPS:
      _request_pickups(action.mcarray);
      Store.emitChange();
      break;
  
    case ActionTypes.REQUEST_DROPOFF:
    
      _request_dropoff(action.mcarray);
      Store.emitChange();
      break;
    
    case ActionTypes.ACTIVATE_PICKUP:
      _activatePickup();
      Store.emitChange();
      break;
    
    case ActionTypes.ACTIVATE_DROPOFF:
      _activateDropoff()
      Store.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = Store;
