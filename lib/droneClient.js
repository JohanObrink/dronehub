(function(exports) {

	var EventEmitter = process.EventEmitter;
	var ioClient = require('socket.io-client');
	
	/**
	 * DroneClient constructor.
	 *
	 * @constructor
	 * @api public
	 */
	var DroneClient = exports.DroneClient = function(id) {

		this.id = id;

	};

	/**
	 * Make event emitter
	 */
	DroneClient.prototype.__proto__ = EventEmitter.prototype;

	/**
	 * Connect lient to societ.io server
	 *
	 * @api public
	 */
	DroneClient.prototype.connect = function(hostAddress, callback) {

		var _this = this;
		var client = ioClient.connect(host);

		client.on('connect', function() {

			client.emit('connect_drone', drone._id, function(err) {
				
				if(err) {

					client.disconnect();
					callback(err);

				} else {

					_this.client = client;
					callback();

				}

			});

		});
	};



})(module.exports);