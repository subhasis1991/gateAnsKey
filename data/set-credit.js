var fileName = 'cs2';

var anskey = require('./' + fileName + '.json'),
    _ = require('underscore'),
    fs = require('fs'),
    credit1 = require('./credit1/credit1-' + fileName);

_.each(anskey, function (val, key){
    if (credit1[key]) {
        anskey[key]['credit'] = 1;
    }else{
        anskey[key]['credit'] = 2;
    }
})

fs.writeFile(fileName + '.json', JSON.stringify(anskey), function(err){
    if (err) {
        console.log(err);
    }
})