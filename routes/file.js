var express = require('express');
var router = express.Router();


var uploadHandler= require('./../module/upload-handler');
var ERR = require('./../module/ERR');
var util = require('./../module/util');

var mongoose = require('mongoose');
var Answer = mongoose.model('Answer');

/**
* @param req -> {}
* @return create status
*/
router.post('/upload', function(req, res, next) {
  uploadHandler(req, res, next);
});

/**
* @return index page 
*/
router.get('/test', function(req, res, next) {
  res.setHeader('stat', {err:1, errcode: ERR.TEST})
  if (res.getHeader('stat').err) {
    console.log('error');
  }
  res.send();
});

/**
* @return index page 
*/
router.get('/', function(req, res, next) {
    res.setHeader('err', 1);
    res.setHeader('errcode',  ERR.NOT_FOUND);

    util.log('ERROR :'+ ERR.NOT_FOUND);
});

module.exports = router;
