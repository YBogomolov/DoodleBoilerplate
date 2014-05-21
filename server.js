var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var http = require('http');
var express = require('express');

var app = express();
require('./config/express')(app);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});
