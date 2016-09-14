var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;

/**
 * @module actions/StatusActionCreator
 */
module.exports = {

  createPin: function(latlng) {
    Dispatcher.dispatch({
      type: ActionTypes.CREATE_PIN,
      latlng: latlng
    });
  },

  createPolyPin: function(latlng) {
    Dispatcher.dispatch({
      type: ActionTypes.CREATE_POLY_PIN,
      latlng: latlng
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