var util = require('util');

// Listing page for drones
exports.index = function(req, res) {
	res.send('Drones!');
}

exports.show = function(req, res) {
	res.send('drones#show: ' + util.inspect(req.drone));
}

exports.new = function(req, res) {
	res.send('drones#new');
}

exports.create = function(req, res) {
	res.send('drones#create');
}

exports.edit = function(req, res) {
	res.send('drones#edit: ' + util.inspect(req.drone));
}

exports.update = function(req, res) {
	res.send('drones#update: ' + util.inspect(req.drone));
}

exports.load = function(id, callback) {
	var obj = { id: id, name: 'Johan ' + id };
	callback(null, obj);
}