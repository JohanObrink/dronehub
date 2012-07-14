var DroneConnection = require('../../lib/drone').DroneConnection;
var ioClient = require('socket.io-client');

describe('Drone', function() {

	var server;

	beforeEach(function() {
		server  = createDroneServer();
	});

	afterEach(function() {
		server.close();
	});

	describe('DroneConnection', function() {

		var socket, droneConnection;

		beforeEach(function(done) {

			var socket = ioClient.connect(host);
			socket.on()

		});


		it('should emit transmit-[event] events as [event]', function(done) {



		});

	});

});