// call the packages we need
var express    = require('express');        
var app        = express();                 
var mongoose   = require('mongoose');

var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);