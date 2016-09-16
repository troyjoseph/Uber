var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: Object.freeze(keyMirror({
    
    ADD_POLY_PIN: null,
    CREATE_MAP: null,
    
    RECEIVE_PICKUPS: null,
    RECEIVE_DROPOFFS: null,
    
    REQUEST_PICKUPS: null,
    REQUEST_DROPOFFS: null,

    ACTIVATE_PICKUP: null,
    ACTIVATE_DROPOFF: null,
  }))

}