var mongoose = require('mongoose');

exports.init = function() {
	mongoose.model('Drone', require('./drone'));
}