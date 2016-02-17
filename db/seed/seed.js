var request = require('request');
var data = require('./../../data/data1.json');
var Answer = require('../Answer');
var _ = require('underscore');


var url = 'http://127.0.0.1:3000/file/save-answer'
var len = 0;
var answer = {};
var saveData = [];
for (d in data) {

    var _type = 0;

    if (data[d]['ChosenOption']) {
        // console.log(data[d]['ChosenOption']);
        _type = 1;
        // console.log(_type);
    }else if (data[d]['GivenAnswer']){
        // console.log(data[d]['GivenAnswer']);
        _type = 2;
        // console.log(_type);
    }

    len++;

    var item = {
        id: d,
        answer: data[d]['ChosenOption'] || data[d]['GivenAnswer'],
        type: _type,
        stream:'cs',
        qSet: '1',
        credit: 1
    }

    saveData.push(item)
    item = {};
    _type = 0;
}

//seed here
_.each(saveData,function(dat, index) {
    //seed it here
    request({ url: url, method: 'PUT', 
        json: dat
    }, 
        function (){
            console.log('done' + dat);
        }
    );
});