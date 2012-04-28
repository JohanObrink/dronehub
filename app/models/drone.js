var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Drone = module.exports = new Schema({
	name: String,
	created: { type: Date, default: Date.now }
});