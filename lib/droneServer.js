/**
 * Dronehub
 * Copyright(c) 2011 Cyborg Unicorn <johan.obrink@gmail.com>
 * MIT Licensed
 */
(function(exports) {

	var EventEmitter = process.EventEmitter;
	var util = require('util');
	var _ = require('underscore');
	var DroneConnection = require('./drone').DroneConnection;
	var UserConnection = require('./user').UserConnection;

	/**
	 * DroneServer constructor.
	 *
	 * @constructor
	 * @api public
	 */
	var DroneServer = exports.DroneServer = function(io) {

		//Connected clients
		this.clients = {};

		//Connected clients that are drones
		this.drones = {};

		//Connected clients that are users
		this.users = {};

		this.io = io;

		//Setup listeners on socket.io
		var _this = this;
		this.io.on('connection', function(socket) {
			_this.onConnection(socket);
		});
	};

	/**
	 * Make event emitter
	 */
	DroneServer.prototype.__proto__ = EventEmitter.prototype;

	/**
	 * Sets up listeners on client socket
	 *
	 * @api private
	 */
	DroneServer.prototype.onConnection = function(socket) {

		var _this = this;

		// register as a connected client
		this.saveClient(socket);

		// listen for registration of type
		socket.on('drone_connect', function(data, callback) {
			_this.connectDrone(socket, data, callback);
		});

		// listen for auth request
		socket.on('drone_auth', function(data, callback) {
			_this.authenticateWithDrone(socket, data, callback);
		});

		// listen for disconnect
		socket.on('disconnect', function() {
			_this.onDisconnect(socket);
		});
	};

	/**
	 * Ragister new client
	 *
	 * @api private
	 */
	DroneServer.prototype.saveClient = function(socket) {
		this.clients[socket.id] = socket;
	};

	/**
	 * Register client as drone
	 *
	 * @api private
	 */
	DroneServer.prototype.connectDrone = function(socket, data, callback) {
		
		var _this = this;

		if(!data || !data.id) {
			callback('drone id missing');
		} else {

			DroneConnection.connect(socket, data.id, data.events, function(err, droneConnection) {

				if(err) {
					callback(err);
				} else {
					_this.drones[data.id] = droneConnection;
					callback();
				}

			});
		}
	};

	/**
	 * Call authentication on a drone
	 *
	 * @api private
	 */
	DroneServer.prototype.authenticateWithDrone = function(socket, data, callback) {
		if(!data || !data.credentials || !data.credentials.id) {
			callback('Drone credentials missing or incomplete');
		} else {

			var drone = this.drones[data.credentials.id];
			if(!drone) {
				callback('Could not find a Drone with that id');
			} else {
				drone.authenticate(socket, data, callback);
			}
		}
	};
	

	/**
	 * Remove client on disconnect
	 *
	 * @api private
	 */
	DroneServer.prototype.onDisconnect = function(socket) {
		delete this.clients[socket.id];
		delete this.drones[socket.id];
	};

	/**
	 * Close the server
	 *
	 * @api private
	 */
	DroneServer.prototype.close = function() {
		this.io.server.close();
	};

	/**
	 * Static create function
	 *
	 * @api public
	 */
	exports.create = function(io) {
		return new DroneServer(io);
	};

})(module.exports);