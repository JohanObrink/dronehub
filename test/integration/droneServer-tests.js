var ioClient = require('socket.io-client'),
	_ = require('underscore'),
	async = require('async');

var server, drone, user;

describe('DroneServer', function() {

	before(function(done) {

		async.parallel([ addDrone, addUser ], function(err, results) {
			if(err)
				throw err;

			drone = results[0];
			user = results[1];
			done();
		});

	});

	after(function(done) {

		async.parallel([ removeDrones, removeUsers ], done);

	});

	beforeEach(function() {
		server = createDroneServer();
	});

	afterEach(function() {
		server.close();
	});

	it('should store clients on connect', function(done) {

		expect(_.size(server.clients)).to.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {

			expect(_.size(server.clients)).to.equal(1);
			done();

		});

	});

	it('should remove clients on disconnect', function(done) {

		expect(_.size(server.clients)).to.equal(0);

		var client = ioClient.connect(host);
		
		client.on('connect', function() {

			expect(_.size(server.clients)).to.equal(1);
			
			client.on('disconnect', function() {

				// Wait for server to finish
				setTimeout(function() {
					expect(_.size(server.clients)).to.equal(0);
					done();
				}, 50);
			});

			client.disconnect();

		});

	});

	it('should connect Drone with correct id', function(done) {
		expect(_.size(server.drones)).to.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			expect(_.size(server.clients)).to.equal(1);

			client.emit('drone_connect', { id: drone._id, events: [] }, function(err) {
				expect(err).to.be.undefined;
				expect(_.size(server.clients)).to.equal(1);
				expect(_.size(server.drones)).to.equal(1);
				done();
			});

		});
	});

	it('should return an error when trying to connect Drone with incorrect id', function(done) {
		expect(_.size(server.drones)).to.equal(0);

		var client = ioClient.connect(host);
		client.on('connect', function() {
			expect(_.size(server.clients)).to.equal(1);

			client.emit('drone_connect', 'ed-209', function(err) {
				expect(err).to.not.be.null;
				expect(_.size(server.clients)).to.equal(1);
				expect(_.size(server.drones)).to.equal(0);
				done();
			});

		});
	});

});