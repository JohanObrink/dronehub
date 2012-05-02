require('../test_helper.js').controller('drones', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        name: '',
        description: '',
        created: '',
        connectionKey: '',
        connected: ''
    };
}

exports['drones controller'] = {

    'GET new': function (test) {
        test.get('/drones/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/drones', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Drone.find;
        Drone.find = sinon.spy(function (id, callback) {
            callback(null, new Drone);
        });
        test.get('/drones/42/edit', function () {
            test.ok(Drone.find.calledWith('42'));
            Drone.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Drone.find;
        Drone.find = sinon.spy(function (id, callback) {
            callback(null, new Drone);
        });
        test.get('/drones/42', function (req, res) {
            test.ok(Drone.find.calledWith('42'));
            Drone.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var drone = new ValidAttributes;
        var create = Drone.create;
        Drone.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, drone);
            callback(null, drone);
        });
        test.post('/drones', {Drone: drone}, function () {
            test.redirect('/drones');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var drone = new ValidAttributes;
        var create = Drone.create;
        Drone.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, drone);
            callback(new Error, drone);
        });
        test.post('/drones', {Drone: drone}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Drone.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/drones/1', new ValidAttributes, function () {
            test.redirect('/drones/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Drone.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/drones/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

