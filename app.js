// packages
var express = require('express');
// var http = require('http');
var pug = require('pug');
var path = require('path');
var bodyParser = require('body-parser');
var marked = require('marked');

// app config
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
var base = require('./routes/base');
app.use('/', base);

// api
var task_api = require('./api/task');
app.use('/api/v1/task', task_api);
var board_api = require('./api/board');
app.use('/api/v1/board', board_api);

// 404
app.use(function(req, res){
    res.render('login');
});

// start on port
app.listen(app.get('port'), function() {
	console.log('listening on port ' + app.get('port'));
});
