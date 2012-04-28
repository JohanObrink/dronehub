var express = require('express'),
	app = express.createServer(),
	port = 3000;

require('express-resource');

app.resource('/', require('./modules/root'));
app.resource('drones', require('./modules/drones'));

app.listen(port);
console.log('Listening on port ' + port);