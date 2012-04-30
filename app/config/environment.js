module.exports = function(app, express){
	var bootstrap = require('bootstrap-stylus'),
		stylus = require('stylus'),
		jasmine = require('jade');

	// Jade
	app.set('views', __dirname + '/../views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());

	// Stylus
	function compile(str, path) {
		return stylus(str)
			.set('filename', path)
			.use(bootstrap());
	}
	app.use(stylus.middleware({
		src: __dirname + '/../../public',
		compile: compile
	}));

	app.use(app.router);
	app.use(express.static(__dirname + '/../../public'));
	
	// Logger
	app.configure(function() {
		app.use(express.logger());
	});

	// Development
	app.configure('development', function() {
		app.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
		app.set('db', 'localhost/droidhub');
	});

	// Production
	app.configure('production', function() {
		app.use(express.errorHandler());
		app.set('db', '');
	});
};

