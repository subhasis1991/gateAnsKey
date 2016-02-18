var express = require('express');
var router = express.Router();


var uploadHandler= require('./../module/upload-handler');
var ERR = require('./../module/ERR');
var util = require('./../module/util');

var mongoose = require('mongoose');
var Answer = mongoose.model('Answer');
var AnsSet = mongoose.model('AnsSet');


/**
* @param data specific to :id
* @return update status
*/
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var dat = req.body;

  var answer = new Answer({
      id: dat.id,
      answer: dat.answer,
      type:dat.type,
      stream:dat.stream,
      qsetno:dat.qsetno,
      credit: dat.credit
    })

  answer.findById(function (err, data) {
  if (data.length === 0) {
    answer.save(function(err){
      if (!err) {
        res.json({done: 1})
      }else{
        res.json({err:1})
      }
    })
    }else{
      res.json({exists: 1});
    }
  })


});

/**
* @param data specific to :id
* @return update status
*/
router.put('/qset/:id', function(req, res, next) {
  var body = req.body;
  var queryObj = {
    stream: body.queryObj.stream,
    qsetno: body.queryObj.qsetno
  }

  var ansSet = new AnsSet(queryObj);

      ansSet.findByStreamQset(function(err, data){

        if (!err && (data.length === 0)) {
            console.log('-------------------');
            Answer.find(queryObj, function (err, docs){
                
                if (!err) {
                    ansSet.answers = body.docs;
                    ansSet.qcount = body.docs.length;

                        ansSet.save(function(err){
                            if (!err) {
                                res.json({done: 1})
                            }else{
                                res.json({err:1})
                            }
                        })//end save
                  }else{
                    console.log('\nERROR :' + err);
                  }
            })//end find answer
        }else if(!err && (data.length !== 0)){
          res.json({exists: 1});
        }

      });

});

/**
* @param :id
* @return :id specific edit page
*/
router.get('/:id', function(req, res, next) {
  Answer.findOne({id: req.params.id}, function (err, doc){
    if (!err) {
      res.json(doc);
    }else{
      res.json({err:1, errcode:ERR.NOT_IN_DB_ERR});
    }
  });
});

/**
* @param :id
* @return :id specific edit page
*/
router.get('qset/:stream/:qsetno', function(req, res, next) {
  AnsSet.findOne({stream: req.params.stream, qsetno: req.params.qsetno}, function (err, doc){
    if (!err) {
      res.json(doc);
    }else{
      res.json({err:1, errcode:ERR.NOT_IN_DB_ERR});
    }
  });
});



module.exports = router;
