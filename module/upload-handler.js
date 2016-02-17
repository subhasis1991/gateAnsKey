var fs = require('fs');
var path = require('path');

var _ = require('underscore'),
Busboy = require('busboy');

var mongoose = require('mongoose');
var Answer = mongoose.model('Answer');
var AnsSet = mongoose.model('AnsSet');

var digester = require('./../module/digester');
var util = require('./util');
var ERR = require('./ERR');
var evaluateMarks = require('./evaluate-marks');
var config = require('./../db/seed/config');

module.exports = function uploadHandler (req, res, next) {

var tempFileName = util.randStr(20);

  var busboy = new Busboy({ headers: req.headers });

  //create a temp file name in uploads directory
  var tempFilePath = path.join(__dirname, '../uploads', './'+ tempFileName + '.html');

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (file && (mimetype === 'text/html')) {

      file.on('data', function(fileData) {

          //save the uploaded file
          fs.writeFile(tempFilePath, fileData,'utf-8', function(err){
            if (err) {
              res.setHeader('err',1);
              res.setHeader('errcode', ERR.TEMP_FILE_SAVE_ERR);

              util.log('ERROR :' + ERR.TEMP_FILE_SAVE_ERR);
              util.unlink(tempFilePath);
            }//else saved
          })
      });//end on data

      file.on('end', function() {

      });
    }else{
      //wrong file type uploaded
      res.setHeader('err', 1);
      res.setHeader('errcode', ERR.WRONG_FILE_TYPE_UPLOADED_ERR);

      util.log('ERROR :' + ERR.WRONG_FILE_TYPE_UPLOADED_ERR);
      util.unlink(tempFilePath);
    }//end if file type check

  });//END busboy on file

  busboy.on('finish', function() {

    fs.stat(tempFilePath, function(err, stats){
      
      if (!err && stats.isFile()) {

        /*
        |--------------------------------------------------------------------------
        | DIGEST UPLOADED DATA AND EVALUATE
        |--------------------------------------------------------------------------
        */

        //start processing the anser page
        digester(tempFilePath, function(err, digested){

          //create a quidtion Id file
          if (config.doseed) {
            util.saveQFile('./data/' + config.stream + config.qsetno + '.json', JSON.stringify(digested.data));
          }
          

          if (!err) {
            //compare and generate result
            var params = {
              req: req,
              res: res,
              next: next,
              tempFilePath: tempFilePath
            };
            evaluateMarks.eval(digested, params);
          }else{
            res.setHeader('err', 1);
            res.setHeader('errcode',  ERR.TEMP_FILE_DIGESTION_ERR);

            util.log('ERROR :' + ERR.TEMP_FILE_DIGESTION_ERR);
            util.unlink(tempFilePath);
          }


        });//digest

      //some file stat error found
      }else{
        if (err) {
          res.setHeader('err', 1);
          res.setHeader('errcode', ERR.TEMP_FILE_STAT_ERR);

          util.log('ERROR :' + ERR.TEMP_FILE_STAT_ERR);
          util.unlink(tempFilePath);
        }else if (!stats.isFile()) {
          res.setHeader('err', 1);
          res.setHeader('errcode', ERR.TEMP_FILE_PATH_NOT_FOUND_ERR);

          util.log('ERROR :' + ERR.TEMP_FILE_PATH_NOT_FOUND_ERR);
          util.unlink(tempFilePath);
        }
      }

    })//end stat check
    
  });//END busboy on finish

    req.pipe(busboy);
}

          