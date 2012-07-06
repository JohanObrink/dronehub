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
		socket.on('connect_drone', function(drone_id, callback) {
			_this.connectDrone(socket, drone_id, callback);
		});

		// listen for registration of type
		socket.on('connect_user', function(user_id, callback) {
			_this.connectUser(socket, user_id, callback);
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
	DroneServer.prototype.connectDrone = function(socket, id, callback) {
		
		var _this = this;

		DroneConnection.connect(id, socket, function(err, droneConnection) {

			if(err) {
				callback(err);
			} else {
				_this.drones[id] = droneConnection;
				callback();
			}

		});
	};

	/**
	 * Register client as user
	 *
	 * @api private
	 */
	DroneServer.prototype.connectUser = function(socket, id, callback) {
		
		var _this = this;

		UserConnection.connect(id, socket, function(err, userConnection) {

			if(err) {
				callback(err);
			} else {
				_this.users[id] = userConnection;
				callback();
			}

		});
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