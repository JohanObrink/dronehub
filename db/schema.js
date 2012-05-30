/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/
var Drone = describe('Drone', function () {
    property('name', String, { index: true });
    property('description', String);
    property('created', Date, { default: Date.now });
    property('connectionKey', String);
    property('connected', Boolean, { default: false });
});

var User = describe('User', function () {
    property('name', String, { index: true });
    property('email', String);
    property('githubId', String);
    property('twitterId', String);
    property('facebookId', String);
    property('username', String);
    property('password', String);
});

var UserDrone = describe('UserDrone');

User.hasMany(UserDrone, {as: 'drones',  foreignKey: 'userId'});
Drone.hasMany(UserDrone, {as: 'users',  foreignKey: 'droneId'});

UserDrone.belongsTo(User, {as: 'user', foreignKey: 'userId'});
UserDrone.belongsTo(Drone, {as: 'drone', foreignKey: 'droneId'});