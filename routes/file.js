var express = require('express');
var router = express.Router();
var fs = require('fs');
var Busboy = require('busboy');
var digester = require('./../module/digester');
var path = require('path');
var _ = require('underscore');
var Chance = require('chance');

var chance = new Chance();

function newString(len){
    return chance.string({
        length: len,
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'});
}

var mongoose = require('mongoose');
var Answer = mongoose.model('Answer');
var keyVal = require('./../data/data.json');



/**
* @param req -> {}
* @return create status
*/

router.post('/upload', function(req, res, next) {
  var error = {};
  var ret;
  var nonAttempt = 0;
  var qcount = 0;
  var right = 0;
  var wrong = 0;
  var credit = 0;
  var userInfo;
  var fileName = newString(20);

  var busboy = new Busboy({ headers: req.headers });
  var filePath = path.join(__dirname, '../uploads', './'+ fileName + '.html');

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (file && (mimetype === 'text/html')) {
    
      // console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
          fs.writeFile(filePath, data,'utf-8', function(err){
            if (err) {
              console.log(err);
            }else{
              // console.log(filePath);
            }
          })
      });

      file.on('end', function() {

      });
    }else{
      res.send({err: 1, msg: 'Please Upload html file only', errCode: 0})  ;
      res.end();
    }//end if
  });

    // busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //   console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    // });

    busboy.on('finish', function() {
      fs.stat(filePath, function(err, stats){
        if (!err && stats.isFile()) {
          //start processing the anser page
          digester(filePath, function(err, digested){
          // console.log(digested.data);
          //compare and generate result
          Answer.find({stream:'cs', qSet: '1'}).exec(function(err, docs){
            _.each(docs, function(doc, index){
              var id,
                  ans,
                  type,
                  response,
                  responseType,
                  digestIt,
                  id = doc['id'],
                  ans = doc['answer'],
                  type = doc['type'];
              if (!id || !(digested.hasOwnProperty('data')  
                && digested['data']
                && digested.hasOwnProperty('userInfo') 
                && digested['userInfo']
                )) {
                res.send({err:1, msg: 'question not found in database'});
                res.end();
              }else{
                userInfo = digested.userInfo;
                digestIt = digested.data[id];
                  
                //match answer
                if (digestIt['ChosenOption'] && (digestIt['ChosenOption']!= '--')) {
                  
                  response = digestIt['ChosenOption'];
                  responseType = 1;
                }else if (digestIt['GivenAnswer'] && (digestIt['GivenAnswer']!= '--')) {
                  
                  response = digestIt['GivenAnswer'];
                  responseType = 2;
                }else if ((digestIt['GivenAnswer'] === '--') || (digestIt['ChosenOption'] === '--')) {
                  // console.log('++++++++++++++++++++');
                  responseType = 0
                }else {
                  //err
                  // console.log('~~~~~~~~~~~~~~~~~~~');
                  res.send({err: 1, msg: 'wrong data found'});
                }

                if(!responseType){
                  // console.log('000000000000000000000');
                  //not attempted
                  nonAttempt++;
                  digestIt['status'] = 0;
                }else if ((responseType == type) && (response == ans)) {
                  //correct answer
                  digestIt['status'] = 1;
                  right++;
                  credit += doc['credit'];
                  // console.log('>>>>>>>>>>>>>>>>>>>>>');
                }else{
                  // console.log('<<<<<<<<<<<<<<<<<<<<');
                  // wrong answer
                  wrong++;
                  digestIt['status'] = -1;
                  if (responseType === 1) {
                    //negative marking
                    if (doc['credit']) {
                      credit -= doc['credit'] * (1/3);
                    }
                  }else{
                    //ok

                  }

                }

                digestIt['type'] = type;
                digestIt['answer'] = ans;
                digestIt['credit'] = doc['credit'];
                qcount++;
              }
            })//end each
            ret = {
              arr : digested.data,
              nonAttempt: nonAttempt,
              credit:credit,
              right: right,
              wrong:wrong,
              qcount:qcount,
              userInfo:userInfo
            }

            //delete temp file
            fs.unlink(filePath, function(err){
              if (!err) {
                console.log('unlinking done');
              }
            })

            res.json(ret);

          });//end Answer find



          });
        }else{
          if (err) {
            res.send({err:1, msg: err});
            res.end();
          }
        }
      })//end stat

      // res.writeHead(303, { Connection: 'close', Location: '/' });
    });

    req.pipe(busboy);
});

router.put('/save-answer', function(req, res, next) {
  var data = req.body;
  console.log(data);
  var answer = new Answer({
    id: data.id,
    answer: data.answer,
    type:data.type,
    stream:data.stream,
    qSet:data.qSet,
    credit: data.credit
  })
  answer.save(function(err, data){
        if (!err) {
            var resdata = {
                "done": true
            }
            var dataToSend = JSON.stringify(resdata);
            res.send(dataToSend);
        }else{
            var resdata = {
                "done": false,
                "error_msg": err
            }
            var dataToSend = JSON.stringify(resdata);
            res.send(dataToSend);
        }
    })
});


/**
* @return index page 
*/
router.get('/', function(req, res, next) {
  res.json(keyVal);
});

module.exports = router;
