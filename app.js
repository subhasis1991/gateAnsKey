var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' })
var config = require('./config/config');

//registering Schema s
require('./db/Answer');
require('./db/AnsSet');
require('./db/User');

var routes = require('./routes/index');
var users = require('./routes/users');
var file = require('./routes/file');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('base', path.resolve('./'));
console.log(app.get('base'));


//connect mongodb
if (config.ENV == "DEV") {
    var mongoConnect = require('./config/connection-dev');
}else if(config.ENV == "PRODUCTION"){
    var mongoConnect = require('./config/connection-prod');
}


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.post('/file/upload', multer({ dest: 'uploads/' }).single('avatar'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/file', file);


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
    error: {}
  });
});


module.exports = app;
