var mongoose = require('mongoose');
var dbparam = require('./db');


var conn = (function () {
    var options = {
        //keep 2 poll connection
        server: { poolSize: 2 },
        replset: { rs_name: 'myReplicaSetName' },
    };
    options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };

    var dbURI = 'mongodb://' + dbparam.host +'/'+ dbparam.database;

    var db = mongoose.connection;

    db.on('error', console.error);

    db.once('open', function() {
        console.log('Connected to database!');
    });

    //
    var connect = function (){
        mongoose.connect(dbURI, options);
    }

    //
    var graceFullExit = function () {
        mongoose.connection.close(function () {
            console.log('Mongoose disconnected through app termination');
            process.exit(0);
        });
    }

    //create the connection
    connect();

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {  
        graceFullExit();
    });

    return {
        close : graceFullExit,
        reconnect: connect,
        conn: this
    }
})(mongoose);

module.exports = conn;