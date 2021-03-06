'use strict';
global.__basedir = __dirname + '/';
process.title = "miner-manager";
var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors/safe');
var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'data/system.log', maxLogSize: 50*1024, backups:1, category: ['system', 'config', 'mining', 'stratumTest'] }
  ]
});
var logger = log4js.getLogger('system');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(express.static(__dirname + '/app'));

require(__basedir + 'api/routes')(app);

// wildcard route to get angular app loaded before angular takes over client-side routing
app.route('*').get(function(req, res) {
  res.sendFile('index.html', {
    root: './'
  });
});

global.listener = app.listen(process.env.PORT || 8082, function(){
  logger.info('server running on port '+listener.address().port);
});

process.on('uncaughtException', function (err) {
  logger.error(err.stack);
});