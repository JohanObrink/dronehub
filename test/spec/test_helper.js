(function() {

  global.Drone = require('../../lib/drone').Drone;

  global.User = require('../../lib/user').User;

  global.io = require('socket.io');

  global.clientIo = require('socket.io-client');

  global.expect = require('chai').expect;

  require('mocha-cakes');

  require('mongoose').connect('mongodb://localhost/dronehub-test');

  global.port = 5000;

  global.host = '';

  global.createDroneServer = function() {
    var socket;
    socket = io.listen(++port, {
      'log level': 1
    });
    global.host = 'http://localhost:' + port;
    return require('../../lib/droneServer').create(socket);
  };

  global.addDrone = function(cb) {
    var drone;
    drone = new Drone;
    drone.name = 'Panda boat';
    return drone.save(function(err) {
      return cb(err, drone);
    });
  };

  global.removeDrones = function(cb) {
    return Drone.remove(function(err) {
      return cb(err);
    });
  };

  global.addUser = function(cb) {
    var user;
    user = new User;
    user.name = 'Andy';
    return user.save(function(err) {
      return cb(err, user);
    });
  };

  global.removeUsers = function(cb) {
    return User.remove(function(err) {
      return cb(err);
    });
  };

}).call(this);
