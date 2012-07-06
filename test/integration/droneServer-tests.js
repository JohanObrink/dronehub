var should = require('should'),
	io = require('socket.io'),
	ioClient = require('socket.io-client'),
	_ = require('underscore'),
	mongoose = require('mongoose'),
	async = require('async'),

	Drone = require('../../lib/drone').Drone,
	DroneClient = require('../../lib/droneClient').DroneClient,
	User = require('../../lib/user').User;

var port = 5000,
	host;

var server, drone, user;

// Connect db
mongoose.connect('mongodb://localhost/dronehub-test');

// Utility functions
var addDrone = function(cb) {
	drone = new Drone();
	drone.name = 'Panda boat';
	drone.save(function(err) {
		cb();
	});
};
var removeDrones = function(cb) {
	Drone.remove(function(err) {
		cb();
	});
};

var addUser = function(cb) {
	user = new User();
	user.name = 'Andy';
	user.save(function(err) {
		cb();
	});
};
var removeUsers = function(cb) {
	User.remove(function(err) {
		cb();
	});
};

describe('DroneServer', function() {

	before(function(done) {

		async.parallel([ addDrone, addUser ], done);

	});

	after(function(done) {

		async.parallel([ removeDrones, removeUsers ], done);

	});

	beforeEach(function() {

		var socket = io.listen(++port, { 'log level': 1 });
		server = require('../../lib/droneServer').create(socket);
		host = 'http://localhost:' + port;
	});

	afterEach(function() {
		server.close();
	});

	it('should store clients on connect', function(done) {

		_.size(server.clients).should.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {

			_.size(server.clients).should.equal(1);
			done();

		});

	});

	it('should remove clients on disconnect', function(done) {

		_.size(server.clients).should.equal(0);

		var client = ioClient.connect(host);
		
		client.on('connect', function() {

			_.size(server.clients).should.equal(1);
			
			client.on('disconnect', function() {

				// Wait for server to finish
				setTimeout(function() {
					_.size(server.clients).should.equal(0);
					done();
				}, 50);
			});

			client.disconnect();

		});

	});

	it('should connect Drone with correct id', function(done) {
		_.size(server.drones).should.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			_.size(server.clients).should.equal(1);

			client.emit('connect_drone', drone._id, function(err) {
				should.not.exist(err);
				_.size(server.clients).should.equal(1);
				_.size(server.drones).should.equal(1);
				done();
			});

		});
	});

	it('should return an error when trying to connect Drone with incorrect id', function(done) {
		_.size(server.drones).should.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			_.size(server.clients).should.equal(1);

			client.emit('connect_drone', 'ed-209', function(err) {
				should.exist(err);
				_.size(server.clients).should.equal(1);
				_.size(server.drones).should.equal(0);
				done();
			});

		});
	});

	it('should connect User with correct id', function(done) {
		_.size(server.users).should.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			_.size(server.clients).should.equal(1);

			client.emit('connect_user', user._id, function(err) {
				should.not.exist(err);
				_.size(server.clients).should.equal(1);
				_.size(server.users).should.equal(1);
				done();
			});

		});
	});

	it('should return an error when trying to connect User with incorrect id', function(done) {
		_.size(server.users).should.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			_.size(server.clients).should.equal(1);

			client.emit('connect_user', 'cohagen', function(err) {
				should.exist(err);
				_.size(server.clients).should.equal(1);
				_.size(server.users).should.equal(0);
				done();
			});

		});
	});

});