var mongoose = require('mongoose'),
    AnsSet = mongoose.model('AnsSet'),
    _ = require('underscore'),
    fs = require('fs'),
    util = require('./util');
    ERR = require('./ERR'),
    config = require('./../db/seed/config')


var _eval = function evaluateMarks(digested, params){

  var lenn=0;
  _.each(digested.data,function(){
    lenn++;
  })
  
var ret,
    res = params.res,
    req = params.req,
    next = params.next,
    tempFilePath = params.tempFilePath,
    userInfo = digested.userInfo,
    allRes = digested.data,
    nonAttempt = 0,
    qcount = 0,
    right = 0,
    wrong = 0,
    credit = 0,
    subject,
    qsetno;

  if (userInfo.subject) {
    var fspace = userInfo.subject.indexOf(' ');
    subject = userInfo.subject.slice(0,fspace-1).toLowerCase();
    qsetno = parseInt(userInfo.subject.slice(fspace-1,fspace));
  }

  // console.log(subject);
  // console.log(qsetno);

  //verify stream and subject compatibility
  if (qsetno && subject && (config.doseed === 0)) {

    AnsSet.findOne({stream: subject, qsetno: qsetno}, function(err, doc){
      var answers = doc.answers;

      console.log(answers.length);

      _.each(answers, function(doc, index){
        var id,
            ans,
            type,
            response,
            responseType,
            digestIt,
            id = doc['id'],
            ans = doc['answer'],
            type = doc['type'];

        if (!id ) {
          //use seHeader instead for error handling
          res.setHeader('err', 1);
          res.setHeader('errcode', ERR.QUESTION_NOT_FOUND_ERR);

          util.log('ERROR :'+ ERR.QUESTION_NOT_FOUND_ERR);

          
        }else{

          digestIt = allRes[id];
          
          if (digestIt) {
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
              // console.log(digested.data[id]);
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


          }else{//end if digestIt
            //error 
          }
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

      //delete temp file and send senponse
      fs.unlink(tempFilePath, function(err){
        if (!err) {
            
          //check if any error is catched before
          if (res.getHeader('err')) {
            //found error

            res.setHeader('err', 1);
            res.setHeader('errcode', ERR.APP_SERVER_ERR);
            res.setHeader('msg', 'APP_SERVER_ERROR');

            util.log('ERROR :' + ERR.APP_SERVER_ERR);
          }//end if err

          /*
          |--------------------------------------------------------------------------
          | FINALLY SEND RESPONSE
          |--------------------------------------------------------------------------
          */
          // console.log(ret.arr);
            res.json(ret);
            console.log('----------');

        }else{
          res.setHeader('err', 1);
          res.setHeader('errcode',  ERR.TEMP_FILE_UNLINK_ERR);
          
          util.log('ERROR :'+ ERR.TEMP_FILE_UNLINK_ERR);
          res.end();
          console.log('-----------------');
        }
      })//end fs.unlink

    });//end Answer find

    //else proper subject or setno not available
  }else{
    res.setHeader('err', 1);
    res.setHeader('errcode',  ERR.QUERY_ERR);

    util.log('ERROR :'+ ERR.QUERY_ERR);
    res.end();
  }

}//end _eval


module.exports = {
  eval: _eval
}