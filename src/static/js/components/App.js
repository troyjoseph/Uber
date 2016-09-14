var React = require('react');
var Map = require('./Map');
var DisplayChooser = require('./DisplayChooser');
var PickupDropoff = require('./PickupDropoff')


var App = React.createClass({

	getInitialState(){
		return {
			mapCoordinates: {
				lat: 40.7301753,
				lng: -73.9903576
			}
		};
	},

	render(){

		return (

			<div>
				<div className="map_container">
					<Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />
				</div>
				<div className="right_container">
				    <h3>Uber Visualizer</h3>
				    <PickupDropoff/>
				    <DisplayChooser />
				</div>
			</div>

		);
	}

});

module.exports = App;