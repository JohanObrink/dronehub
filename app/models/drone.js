var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Drone = new Schema({
	name: String,
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drone', Drone);