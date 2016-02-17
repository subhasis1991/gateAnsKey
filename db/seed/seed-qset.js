var config = require('./config');

var mongoose = require('mongoose');
require('../AnsSet');
require('../Answer');
// var People = require('../People');

var AnsSet = mongoose.model('AnsSet');
var Answer = mongoose.model('Answer');


var _ = require('underscore');
var mongoConnect = require('../../config/connection-dev');






// module.exports = function (mongoConnect){


    // console.log(mongoConnect);
    var queryObj = {
        stream: config.stream,
        qsetno: config.qsetno
    }

    var ansSet = new AnsSet(queryObj);

    ansSet.findByStreamQset(function(err, data){
        if (!err && (data.length === 0)) {
            console.log('-------------------');
            Answer.find(queryObj, function (err, docs){
                if (!err) {
                    ansSet.answers = docs;
                    ansSet.qcount = docs.length;

                    ansSet.save(function(err){
                        if (!err) {
                            mongoConnect.close();
                        }else{
                            console.log('\nERROR :' + err);
                        }
                    })//end save
                }else{
                    console.log('\nERROR :' + err);
                }
            })
            
        }else if(!err && (data.length !== 0)){
            console.log('\nData already exists for Question: '+ config.stream + config.qsetno);
            mongoConnect.close();
        }else{
            console.log('\nERROR :' + err);
            mongoConnect.close();   
        }
    
    })//end ansSet findByStreamQset


// }

