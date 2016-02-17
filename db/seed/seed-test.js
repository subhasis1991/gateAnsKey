// var data = require('./../../data/data1.json');
// var request = require('request');
var mongoose = require('mongoose');
require('../AnsSet');
require('../Answer');
// var People = require('../People');

var AnsSet = mongoose.model('AnsSet');
var Answer = mongoose.model('Answer');


var _ = require('underscore');
var mongoConnect = require('../../config/connection-dev');

// console.log(mongoConnect);
var ansSet = new AnsSet({
    stream: 'cse',
    setno: 1
});

Answer.find({stream:'cs'}, function(err, docs){
    if (!err) {
        ansSet.answers = docs;
        ansSet.qcount = docs.length
        ansSet.save(function(err){
            console.log(err);
            mongoConnect.close();
        })
    }else{
        console.log(err);
    }
})



// ansSet.answer.push
// person.save(function(err){
//     if (err) {
//         console.log(err);
//     }else{
//         console.log('done');
//     }
// });