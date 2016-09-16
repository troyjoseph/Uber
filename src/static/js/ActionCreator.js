var Dispatcher = require('./Dispatcher');
var ActionTypes = require('./Constants').ActionTypes;


module.exports = {
	
  addPolyPin: function(polygon) {
    Dispatcher.dispatch({
      type: ActionTypes.ADD_POLY_PIN,
      polygon: polygon
    });
  },

  createMap: function(map) {
    Dispatcher.dispatch({
      type: ActionTypes.CREATE_MAP,
      map: map
    });
  },

  receviePickups: function(pickups) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_PICKUPS,
      pickups: pickups
    });
  },

  recevieDropoffs: function(dropoffs) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_DROPOFFS,
      dropoffs: dropoffs
    });
  },

  receviePickupCount: function(count) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_PICKUP_COUNT,
      count: count
    });
  },

  recevieDropOffCount: function(count) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_DROPOFF_COUNT,
      count: count
    });
  },

  requestPickups: function(mcarray) {
    Dispatcher.dispatch({
      type: ActionTypes.REQUEST_PICKUPS,
      mcarray: mcarray
    });
  },

  requestDropoffs: function(mcarray) {
    Dispatcher.dispatch({
      type: ActionTypes.REQUEST_DROPOFFS,
      mcarray: mcarray
    });
  },

  activatePickup: function() {
    Dispatcher.dispatch({
      type: ActionTypes.ACTIVATE_PICKUP,
    });
  },

  activateDropoff: function() {
    Dispatcher.dispatch({
      type: ActionTypes.ACTIVATE_DROPOFF,
    });
  },

  
}