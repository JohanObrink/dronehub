global.Drone = require('../../lib/drone').Drone
global.User = require('../../lib/user').User
global.io = require('socket.io')
global.clientIo = require('socket.io-client')
global.expect = require('chai').expect

# mocha cakes Gherkin syntax
require('mocha-cakes')

# Connect db
require('mongoose').connect('mongodb://localhost/dronehub-test')



# Setup server port and address
global.port = 5000
global.host = ''



# Utility functions
global.createDroneServer = () ->
	socket = io.listen(++port, { 'log level': 1 })
	global.host = 'http://localhost:' + port

	require('../../lib/droneServer').create(socket)

global.addDrone = (cb) ->
	drone = new Drone
	drone.name = 'Panda boat'
	drone.save (err) ->
		cb(err, drone)

global.removeDrones = (cb) ->
	Drone.remove (err) ->
		cb(err)

global.addUser = (cb) ->
	user = new User
	user.name = 'Andy'
	user.save (err) ->
		cb(err, user)

global.removeUsers = (cb) ->
	User.remove (err) ->
		cb(err)