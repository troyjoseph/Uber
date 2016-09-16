var React = require('react');
var ActionCreator = require('../ActionCreator');
var Store = require('../Store');


var PickupDropoff = React.createClass({

  getInitialState: function() {
    return {pickupActive: true, count: 0};
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(Store.getPickupDropOffState());
  },

  render(){
    var name = this.state.pickupActive ? "pickups" : "dropoffs";
    var count = this.state.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
       <div className="pickup_dropoff">
          <div className="large" >{count}</div>
          <p>{name}</p> 
        <br/>
        </div>
    );
  }
});

module.exports = PickupDropoff;