var cp = require('child_process');

desc('Integration tests');
task('intest', [], function() {

	var command = 'NODE_ENV=test ' +
		'mocha -R spec ' +
		'--require test/integration/test_helper.js ' +
		'--colors ' +
		'test/integration/*.js';
	
	cp.exec(command, function(err, output) {

		console.log(output);

		if(err)
			throw err;			

	});

});

desc('Integration tests');
task('spec', [], function() {

	var helper = 'test/spec/test_helper';

	cp.exec('coffee -c ' + helper + '.coffee', function(err, output) {

		if(err)
			throw err;

		var command = 'NODE_ENV=test ' +
			'mocha -r should -R spec ' +
			'--compilers coffee:coffee-script ' +
			'--require ' + helper + '.js ' +
			'--colors ' +
			'test/spec/*.coffee';
		
		cp.exec(command, function(err, output) {

			console.log(output);

			if(err)
				throw err;			

		});

	});

	

});

desc('Unit tests');
task('test', [], function() {

	var command = 'NODE_ENV=test ' +
		'mocha -R spec ' +
		'--colors ' +
		'test/lib/*.js';
	
	cp.exec(command, function(err, output) {

		console.log(output);

		if(err)
			throw err;			

	});

});