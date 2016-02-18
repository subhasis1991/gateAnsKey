var config = require('./config');
var _ = require('underscore');
var request = require('request');


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

var temp =0;
var done = 1;
var length = saveData.length;
var count = 0;

var timer = setInterval(function(){
  console.log(length);
  console.log('waiting...');
  if (done && (count < length)) {
    done = 0;

    console.log('\n'+count);
    seedIt(saveData[count], count);
    count++;
  }
  if (count === length) {
    clearInterval(timer);
  }
}, 1000);


function seedIt(dat, index){

  console.log(dat);
  if (config.seed_server ===0) {

    var answer = new Answer({
      id: dat.id,
      answer: dat.answer,
      type:dat.type,
      stream:dat.stream,
      qsetno:dat.qsetno,
      credit: dat.credit
    })

    answer.findById(function (err, data) {
      if (!err) {
         if (data.length === 0) {
          answer.save(function(err){
            if (err) {
              console.log(err);
            }else{
              done = 1;
            }
          })
         }else{
          console.log('\nLOCAL_SERVER +>');
          console.log('Data already exists for this id: ' + dat.id);
          done = 1;
         }
      }else{
        console.log(err);
      }
    })

  }else if (config.seed_server ===1) {
    //save by server request
    //send data
      temp++;
      console.log(config.seed_url + dat.id);

      console.log('SEED_REQUEST_SEND...');
      request({ 
                url: config.seed_url + dat.id,
                method: 'PUT',
                json: dat
              }, 
              function(err, res, body){
                if (!err) {
                  if (body.done) {
                    console.log('\nREMOTE_SERVER +>');
                    console.log('Inserted data With id '+ dat.id);
                    done = 1;
                  }else if (body.exists) {
                    console.log('\nREMOTE_SERVER +>');
                    console.log('Data already exists for this id: ' + dat.id);
                    done = 1;
                  }
                }
              });
  }
}

//seed here
// _.each(saveData,function(dat, index) {
  


// });

// require('./seed-qset')(mongoConnect);



