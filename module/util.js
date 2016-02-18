var Chance = require('chance'),
    chance = new Chance(),
    path = require('path'),
    _ = require('underscore'),
    fs = require('fs');

var gconfig = require('./../config/config');

var _randStr = function newString(len){
    return chance.string({
        length: len,
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'});

}

var _saveQFile = function saveFileToAntPath(filePath, data, cb){

    fs.writeFile(filePath, data, function(cb){
        if (_.isFunction(cb)) {
            cb(err)
        }
    })//end fs write

}

var _unlink = function unlinkFile(filePath, res, cb){
  fs.unlink(filePath, function(err){
    if (!err) {
      if (cb && !_.isFunction(cb)) {
        cb();
      }
    }else{
      if (!res.getHeader('err')) {
        res.setHeader(err, 1);
        res.setHeader('errcode', ERR.TEMP_FILE_UNLINK_ERR);
      }
    }
  })  

}

var _log = function log(data){
  if (gconfig.ENV === 'DEV') {
    console.log(data);
  }else if (gconfig.ENV === 'PRODUCTION') {
    
  }
}
        


module.exports = {
    randStr: _randStr,
    saveQFile: _saveQFile,
    unlink: _unlink,
    log: _log
}