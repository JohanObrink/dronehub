/**
 * Dronehub
 * Copyright(c) 2011 Cyborg Unicorn <johan.obrink@gmail.com>
 * MIT Licensed
 */
(function(exports) {

	var EventEmitter = process.EventEmitter;
	var util = require('util');
	var _ = require('underscore');

	/**
	 * Drone constructor.
	 *
	 * @constructor
	 * @api public
	 */
	var Drone = exports.Drone = function() {

	};

	/**
	 * Make event emitter
	 */
	DroneServer.prototype.__proto__ = EventEmitter.prototype;
	
	/**
	 * authenticate
	 *
	 * @api public
	 */
	DroneServer.prototype.authenticate = function() {
		
	};

	/**
	 * Static create function
	 *
	 * @api public
	 */
 	exports.create = function() {
 		return new Drone();
 	};


})(module.exports);