var DroneConnection = require('../../lib/drone').DroneConnection;
var async = require('async');
var util = require('util');

describe('Drone', function() {

	var server;

	beforeEach(function() {
		server  = createDroneServer();
	});

	afterEach(function() {
		server.close();
	});

	describe('DroneConnection', function() {

		var socket, drone, client, boat, droneEvents, clientEvents;

		beforeEach(function(done) {

			droneEvents = [ 'control.set' ];
			clientEvents = [ 'gps.fix' ];

			async.parallel([
				addDrone,
				connectClient
			], function(err, results) {
				if(err) {
					console.log('Error: ' + err);
					throw new Error(err);
				}

				drone = results[0];
				client = results[1];

				connectDrone(drone.id, droneEvents, function(err, b) {
					if(err) {
						console.log('DONE');
						throw new Error(err);
					}

					boat = b;
					done();
				});
			});

		});


		it('should throw an error when credentials are missing an id', function(done) {
			
			var indata = { credentials: { foo: 'bar' }, events: clientEvents };

			client.emit('drone_auth', indata, function(err) {
				expect(err).to.exist;
				done();
			});
		
		});

		it('should throw an error when drone id does not exist', function(done) {
			
			var indata = { credentials: { id: 'ed-209', foo: 'bar' }, events: clientEvents };

			client.emit('drone_auth', indata, function(err) {
				expect(err).to.exist;
				done();
			});
		
		});


		it('should pass on authentication requests to drone', function(done) {
			var indata = { credentials: { id: drone.id, foo: 'bar' }, events: clientEvents };

			boat.on('auth', function(data) {
				expect(data).to.eql(indata);
				done();
			});

			client.emit('drone_auth', indata, function(err, result) {
				expect(err).to.not.exist;
				if(err)
					done();
			});

		});

		it('should pass on authentication reply to client', function(done) {
			var indata = { credentials: { id: drone.id, foo: 'bar' }, events: clientEvents };
			var expectedReply = true;

			boat.on('auth', function(data, callback) {
				expect(data).to.eql(indata);
				callback(null, expectedReply);
			});

			client.emit('drone_auth', indata, function(err, reply) {
				expect(err).to.not.exist;
				expect(reply).to.equal(expectedReply);
				done();
			});
		});

		it('should start routing messages after authentication', function(done) {
			var indata = { credentials: { id: drone.id, foo: 'bar' }, events: clientEvents };
			var expectedReply = true;
			var controlData = { rudder: -0.5, throttle: 0.75 };
			var gpsData = { lat: 1.098, lon: 50.234 };

			boat.on('auth', function(data, callback) {
				expect(data).to.eql(indata);
				callback(null, expectedReply);
			});
			boat.on('control.set', function(data, callback) {
				expect(data).to.eql(controlData);

				boat.emit('gps.fix', gpsData, function() {});
			});
			client.on('gps.fix', function(data) {
				expect(data).to.eql(gpsData);
				done();
			});

			client.emit('drone_auth', indata, function(err, reply) {
				expect(err).to.not.exist;
				expect(reply).to.equal(expectedReply);
				
				client.emit('control.set', controlData, function() {});
			});
		});

	});

});