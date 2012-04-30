var util = require('util'),
	Drone = require('../models/drone');

// Listing page for drones
exports.index = function(req, res) {
	res.render('drones/index', util.inspect(req.drone));
}

exports.show = function(req, res) {
	res.render('drones/show', util.inspect(req.drone));
}

exports.new = function(req, res) {
	res.render('drones/new');
}

exports.create = function(req, res) {
	res.send('drones#create');
}

exports.edit = function(req, res) {
	res.render('drones/edit', util.inspect(req.drone));
}

exports.update = function(req, res) {
	res.send('drones#update: ' + util.inspect(req.drone));
}

exports.load = function(id, callback) {
	if(!id)
		Drone.find(null, callback);
	else
		callback(null, {});
		//Drone.find({id: id}, callback);
}