var util = require('util'),
	Drone = require('../models/drone');

// Listing page for drones
exports.index = function(req, res) {
	Drone.find({}, function(err, data) {
		res.render('drones/index', { title: 'Drones', drones: data });
	});
}

exports.show = function(req, res) {
	Drone.findOne({ id: req.params.id }, function(err, data) {
		if(err)
			throw err;
		res.render('drones/show', { title: 'Drones | ', drone: data });
	});
}

exports.new = function(req, res) {
	res.render('drones/new', { title: 'New drone' });
}

exports.create = function(req, res) {
	var drone = new Drone();
	drone.name = req.body.name;
	drone.save();
	res.redirect('/drones/' + drone.id + '/');
}

exports.edit = function(req, res) {
	res.render('drones/edit', { title: 'Drones', drone: util.inspect(req.drone) });
}

exports.update = function(req, res) {
	res.send('drones#update: ' + util.inspect(req.drone));
}