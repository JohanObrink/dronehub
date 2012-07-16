var Drone = require('../../lib/drone').Drone;
var User = require('../../lib/user').User;
var io = require('socket.io');
var clientIo = require('socket.io-client');



// Global chai
global.expect = require('chai').expect;



// Connect db
require('mongoose').connect('mongodb://localhost/dronehub-test');



//Setup server port and address
global.port = 5000;
global.host = '';



// Utility functions
global.createDroneServer = function() {

	var socket = io.listen(++port, { 'log level': 1 });
	global.host = 'http://localhost:' + port;

	return require('../../lib/droneServer').create(socket);
};
global.addDrone = function(cb) {
	var drone = new Drone();
	drone.name = 'Panda boat';
	drone.save(function(err) {
		cb(err, drone);
	});
};
global.removeDrones = function(cb) {
	Drone.remove(function(err) {
		cb(err);
	});
};

global.addUser = function(cb) {
	var user = new User();
	user.name = 'Andy';
	user.save(function(err) {
		cb(err, user);
	});
};
global.removeUsers = function(cb) {
	User.remove(function(err) {
		cb(err);
	});
};

global.connectClient = function(cb) {
	var me = clientIo.connect(host, { transports: ['websocket'], 'force new connection': true });
	me.on('connect', function(err) {
		cb(err, me);
	});
}
global.connectDrone = function(id, events, cb) {
	var drone = clientIo.connect(host, { transports: ['websocket'], 'force new connection': true });
	drone.on('connect', function(err) {
		if(err) {
			cb(err);
		} else {

			var data = { id: id, events: events };

			drone.emit('drone_connect', data, function() {
				cb(null, drone);
			});
		}
	});
}