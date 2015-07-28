var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var slots = require('./routes/slots');
var checker = require('./queueChecker')
var agents = require('./agents');

var app = express();

var Datastore = require('nedb');
agentsDB = new Datastore({filename: './agents.db', autoload:true});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'swagger-ui')));

setInterval(
  function() {
    console.log("Check the waiting queue at " + new Date());
    checker.monitorWaitingQueue();
  },
  2*1000);


setInterval(
  function() {
    console.log("Check the agents " + new Date());
    agents.syncAgents();
  },
  10*1000);


app.use('/dispatcher/slots/', slots);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
