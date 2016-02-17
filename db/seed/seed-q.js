var config = require('./config');
var _ = require('underscore');


var mongoose = require('mongoose');

require('../Answer');


var Answer = mongoose.model('Answer');
var mongoConnect = require('../../config/connection-dev');

var data = require('./../../data/'+ config.stream + config.qsetno +'.json');

// var url = 'http://127.0.0.1:3000/file/save-answer'
var len = 0;
var answer = 0;
var saveData = [];
for (d in data) {

    var _type = 0;

    if (data[d]['ChosenOption']) {
        // console.log(data[d]['ChosenOption']);
        _type = 1;
        answer = data[d]['ChosenOption'];
        // console.log(_type);
    }else if (data[d]['GivenAnswer']){
        // console.log(data[d]['GivenAnswer']);
        _type = 2;
        answer = data[d]['GivenAnswer'];
        // console.log(_type);
    }

    len++;

    var item = {
        id: parseInt(d),
        answer:  answer,
        type: _type,
        stream: config.stream,
        qsetno: config.qsetno,
        credit: data[d]['credit'] || 1,
    }

    saveData.push(item)
    item = {};
    _type = 0;
    answer = 0;
}

//seed here
_.each(saveData,function(dat, index) {

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
          if (err) {
            console.log(err);
          }
        })
       }else{
        console.log('Data already exists for this id: ' + dat.id);
       }
  })


});

// require('./seed-qset')(mongoConnect);



