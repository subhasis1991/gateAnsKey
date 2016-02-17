var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('underscore');
var digest = [];
var useInfo = {};


module.exports = function (filePath, cb) {  
console.log(filePath);
//read the file and create a digest
fs.readFile(filePath, 'utf-8', function(err ,data){
    if (!err) {
        var $ = cheerio.load(data);

        var answers = $('table.menu-tbl');
        if (answers.length !==0) {
            var items = answers.find('tbody');
            if (items.length !== 0) {
                items.each(function(index1, elem) {
                    //local var for holding eah item
                    var item = {};
                    var id;
                    $(this).find('tr').each(function(index2, el) {

                       //process the text then push
                       var text = $(this).text();
                       var indexOfDivider = text.indexOf(':');
                       var key = text.slice(0,indexOfDivider).replace(/\s/g, '');
                       var val = text.slice(indexOfDivider+1,text.length).replace(/\s/g, '');
                       item[key] = val;

                       if (id == 664592445) {
                          console.log('-----------------------');
                       }

                       if (index2 ===1) {
                        digest.push(item);
                       }else if (index2 ===0) {
                         id = key;
                       }
                    });
                    
                });

                userInfo = $('.main-info-pnl').find('tbody').html();

                //return the digested data
                if (typeof(cb) === 'function') {
                  var data = {};
                  for (var i = 0; i < digest.length; i++) {
                     
                    if (digest[i]['GivenAnswer']) {
                      data[digest[i]['QuestionID']] = {GivenAnswer: digest[i]['GivenAnswer']};
                    }else{
                      data[digest[i]['QuestionID']] = {ChosenOption: digest[i]['ChosenOption']};
                    }
                  }

                  cb(null, {data: data, userInfo:userInfo});
                }
            }
        }

    }else{
        console.log('ERROR from digester.js' + err);
        if (typeof(cb) === 'function') {
          cb(err, digest);
        }
    }
})

}
