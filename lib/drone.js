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
	var DroneConnection = exports.DroneConnection = function(data, socket) {
		this.data = data;
		this.socket = socket;
	};

	/**
	 * Make event emitter
	 */
	DroneConnection.prototype.__proto__ = EventEmitter.prototype;
	
	/**
	 * Authorize for takeover
	 *
	 * @api public
	 */
	DroneConnection.prototype.takeOver = function(credentials, callback) {
		this.socket.emit('authorize-takeover', credentials, callback);
	};

 	/**
 	 * Static Connect a drone with the specified id
 	 *
 	 * @api public
 	 */
 	DroneConnection.connect = function(drone_id, socket, callback) {
 		Drone.findById(drone_id, function(err, doc) {
 			if(err) {
 				callback(err);
 			} else {
 				callback(null, new DroneConnection(doc, socket));
 			}
 		});
 	};


})(module.exports);