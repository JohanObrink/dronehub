/**
 * Dronehub
 * Copyright(c) 2011 Cyborg Unicorn <johan.obrink@gmail.com>
 * MIT Licensed
 */
(function(exports) {

	var EventEmitter = process.EventEmitter;
	var util = require('util');
	var _ = require('underscore');

	var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

	/**
	 * DroneSchema
	 */
	var DroneSchema = new Schema({
		name: String
	});

	/**
	 * DroneData
	 */
	var Drone = exports.Drone = mongoose.model('Drone', DroneSchema);

	/**
	 * Drone constructor.
	 *
	 * @constructor
	 * @api public
	 */
	var DroneConnection = exports.DroneConnection = function(socket, data, events) {
		this.data = data;
		this.droneEvents = events;
		this.droneSocket = socket;
		this.clientEvents = null;
		this.clientSocket = null;
	};

	/**
	 * Make event emitter
	 */
	DroneConnection.prototype.__proto__ = EventEmitter.prototype;
	
	/**
	 * Authorize for access
	 *
	 * @api public
	 */
	DroneConnection.prototype.authenticate = function(socket, data, callback) {
		
		var _this = this;

		this.droneSocket.emit('auth', data, function(err, reply) {

			if(err) {
				callback(err);
			} else if(reply === true) {
				_this.clientSocket = socket;
				_this.clientEvents = data.events;
				_this.connectStreams(_this.clientSocket, _this.droneSocket, _this.droneEvents);
				_this.connectStreams(_this.droneSocket, _this.clientSocket, _this.clientEvents);
				callback(null, reply);
			} else {
				callback('authentication failed');
			}
		});
	};

 	/**
 	 * Connects the drone's and the client's socket streams
 	 *
 	 * @api private
 	 */
 	DroneConnection.prototype.connectStreams = function(sender, reciever) {

 		//retransmit all events
 		sender.on(sender.id + '_transmit', function(foo) {
 			reciever.emit.apply(reciever, Array.prototype.slice.call(arguments));
 		});
 	};

 	/**
 	 * Static Connect a drone with the specified id
 	 *
 	 * @api public
 	 */
 	DroneConnection.connect = function(socket, drone_id, events, callback) {

 		Drone.findById(drone_id, function(err, doc) {
 			if(err) {
 				callback(err);
 			} else {
 				callback(null, new DroneConnection(socket, doc, events));
 			}
 		});
 	};


})(module.exports);