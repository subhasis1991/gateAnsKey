var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('underscore');



module.exports = function (filePath, cb) {  
  var useInfo = {},
      digest = [];
  //read the file and create a digest
  fs.readFile(filePath, 'utf-8', function(err ,data){
      if (!err) {
          var $ = cheerio.load(data),
              userEl,
              userInfo = {};

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

                  // console.log($('.main-info-pnl').find('tbody').html());
                   userEl= $('.main-info-pnl').find('tbody').find('tr');
                   userEl.each(function(index1, el1){
                     $(this).find('td').each(function(index2, el2){
                      
                      if (index1 == 0) {
                        if (index2 ==1) {
                          userInfo['name'] = $(this).text().trim(); 
                        }
                      }

                      if (index1 == 1) {
                        if (index2 ==1) {
                          userInfo['rollno'] = $(this).text().trim(); 
                        }
                      }

                      if (index1 == 2) {
                        if (index2 ==1) {
                          userInfo['examdate'] = $(this).text().trim(); 
                        }
                      }  

                      if (index1 == 3) {
                        if (index2 ==1) {
                          userInfo['subject'] = $(this).text().trim(); 
                        }
                      }                                         
                     
                     });
                   });
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

                    if (typeof(cb) === 'function') {
                      if (data && userInfo) {
                        cb(null, {data: data, userInfo:userInfo});
                      }else{
                        cb(err);
                      }
                    }//if function
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
