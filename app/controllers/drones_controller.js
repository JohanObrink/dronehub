load('application');

before(loadDrone, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New drone';
    this.drone = new Drone;
    render();
});

action(function create() {
    Drone.create(req.body.Drone, function (err, drone) {
        if (err) {
            flash('error', 'Drone can not be created');
            render('new', {
                drone: drone,
                title: 'New drone'
            });
        } else {
            flash('info', 'Drone created');
            redirect(path_to.drones());
        }
    });
});

action(function index() {
    this.title = 'Drones index';
    Drone.all(function (err, drones) {
        render({
            drones: drones
        });
    });
});

action(function show() {
    this.title = 'Drone show';
    render();
});

action(function edit() {
    this.title = 'Drone edit';
    render();
});

action(function update() {
    this.drone.updateAttributes(body.Drone, function (err) {
        if (!err) {
            flash('info', 'Drone updated');
            redirect(path_to.drone(this.drone));
        } else {
            flash('error', 'Drone can not be updated');
            this.title = 'Edit drone details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.drone.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy drone');
        } else {
            flash('info', 'Drone successfully removed');
        }
        send("'" + path_to.drones() + "'");
    });
});

function loadDrone() {
    Drone.find(params.id, function (err, drone) {
        if (err) {
            redirect(path_to.drones());
        } else {
            this.drone = drone;
            next();
        }
    }.bind(this));
}
