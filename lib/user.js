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
	
		

})(module.exports);