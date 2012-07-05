var should = require('should'),
	io = require('socket.io'),
	ioClient = require('socket.io-client'),
	_ = require('underscore');

var port = 5000,
	host;

describe('DroneServer', function() {

	var server;

	beforeEach(function() {

		var socket = io.listen(++port, { 'log level': 1 });
		server = require('../lib/droneServer').create(socket);
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

	it('should register drones', function(done) {
		_.size(server.drones).should.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			_.size(server.clients).should.equal(1);

			client.emit('register_drone', 'abc-123', function(err) {
				_.size(server.clients).should.equal(1);
				_.size(server.drones).should.equal(1);
				done();
			});

		});
	});

});