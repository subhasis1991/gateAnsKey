var config = require('./config');

var request = require('request');
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
            })//end find answer
            
        }else if(!err && (data.length !== 0)){
            if (config.seed_server ===0) {
              console.log('\nLOCAL_SERVER +>');
              console.log('Data already exists for Question: '+ config.stream + config.qsetno);
              mongoConnect.close();
            }else if (config.seed_server ===1) {
              console.log('\nLOCAL_SERVER');
              console.log('SEARCH_QSET');
              Answer.find(queryObj, function (err, docs){
                
                if (!err) {
                    var qID = queryObj.stream + queryObj.qsetno;

                    //save by server request
                    request({ 
                            url: config.seed_url + 'qset/' + qID, 
                            method: 'PUT',
                            json: {docs: docs, queryObj: queryObj}
                          }, 
                          function(err, res, body){

                            if (!err) {
                              if (body.done) {
                                console.log('\nREMOTE_SERVER +>');
                                console.log('Inserted data With qID '+ qID);
                                mongoConnect.close();
                              }else if (body.exists) {
                                console.log('\nREMOTE_SERVER +>');
                                console.log('Data already exists for this id: ' + qID);
                                mongoConnect.close();
                              }else{
                                console.log('\nREMOTE_SERVER +>');
                                console.log(err);
                                mongoConnect.close();
                              }
                            }

                          });//end put request
                  }else{
                    console.log('\nERROR :' + err);
                  }
              })//end find answer
            }

        }else{
            console.log('\nERROR :' + err);
            mongoConnect.close();   
        }
    
    })//end ansSet findByStreamQset


// }

