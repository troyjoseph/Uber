var $ = require('jquery');
var ActionCreator = require('../ActionCreator');


/**
 * @module utils/GetApi
 */

module.exports = {
  
  /**
   * Loads all the parameters from the server
   * @returns {undefined}
   */
  requestPickups: function(polygon) {
     $.ajax({
        url: '/api/pickups',
        type: 'POST',
        dataType: 'html',
        contentType: "application/json",
        success: function (data) {ActionCreator.receviePickups(JSON.parse(data).pickups);},
        error: function (data) { console.log(data); },
        data: JSON.stringify(polygon)
    });
  },

   requestDropoffs: function(polygon) {
     $.ajax({
        url: '/api/dropoffs',
        type: 'POST',
        dataType: 'html',
        contentType: "application/json",
        success: function (data) {ActionCreator.recevieDropoffs(JSON.parse(data).dropoffs);},
        error: function (data) { console.log(data); },
        data: JSON.stringify(polygon)
    });
  },
/*
   requestPickupCount: function(polygon) {
     $.ajax({
        url: '/api/pickup_count',
        type: 'POST',
        dataType: 'html',
        contentType: "application/json",
        success: function (data) {ActionCreator.receviePickupCount(JSON.parse(data).pickup_count);},
        error: function (data) { console.log(data); },
        data: JSON.stringify(polygon)
    });
  },

   requestDropoffCount: function(polygon) {
     $.ajax({
        url: '/api/dropoff_count',
        type: 'POST',
        dataType: 'html',
        contentType: "application/json",
        success: function (data) {ActionCreator.recevieDropoffCount(JSON.parse(data).dropoff_count);},
        error: function (data) { console.log(data); },
        data: JSON.stringify(polygon)
    });
  },
*/
}