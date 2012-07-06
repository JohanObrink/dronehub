(function(exports) {
	
	var EventEmitter = process.EventEmitter;
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema;


	var UserSchema = new Schema({
		name: String,
		email: String
	});


	/**
	 * UserData
	 *
	 * @api public
	 */
	var User = exports.User = mongoose.model('User', UserSchema);
	

	/**
	 * User constructor
	 *
	 * @api public
	 */
	var UserConnection = exports.UserConnection = function(data, socket) {

	};

	/**
	 * Make event emitter
	 */
	UserConnection.prototype.__proto__ = EventEmitter.prototype;

 	/**
 	 * Static Connect a User with the specified id
 	 *
 	 * @api public
 	 */
 	UserConnection.connect = function(user_id, socket, callback) {
 		if(user_id instanceof User) {
 			callback(null, new UserConnection(user_id, socket));
 		} else {
	 		User.findById(user_id, function(err, doc) {
	 			if(err) {
	 				callback(err);
	 			} else {
	 				callback(null, new UserConnection(doc, socket));
	 			}
	 		});
	 	}
 	};

		

})(module.exports);