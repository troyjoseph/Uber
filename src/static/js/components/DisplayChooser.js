var React = require('react');
var ActionCreator = require('../actions/ActionCreator');
var Store = require('../stores/Store');

var DisplayChooser = React.createClass({

	getInitialState: function() {
		return {pickupActive: true};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState({pickupActive: Store.getPickupDropOffState().pickupActive});
	},
  
  handlePickupClick: function(e){
    if (!this.state.pickupActive){
      ActionCreator.activatePickup();
    }
  },

  handleDropoffClick: function(e){
    if (this.state.pickupActive){
      ActionCreator.activateDropoff();
    }
  },

	render(){
    var pickupState = this.state.pickupActive ? "active" : null;
    var dropoffState = this.state.pickupActive ? null : "active";

		return (
      <ul className="nav nav-pills nav-stacked">
        <li role="presentation" className={pickupState} onClick={this.handlePickupClick}>  <a href="#">Show Pickups</a></li>
        <li role="presentation" className={dropoffState}  onClick={this.handleDropoffClick}> <a href="#">Show Dropoffs</a></li>
      </ul>
		);
	}

});

module.exports = DisplayChooser;