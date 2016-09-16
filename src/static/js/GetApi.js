var $ = require('jquery');
var ActionCreator = require('./ActionCreator');


/**
 * @module utils/GetApi
 */

module.exports = {
  
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
}