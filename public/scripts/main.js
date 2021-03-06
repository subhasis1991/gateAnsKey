jQuery(document).ready(function($) {
    var progressBar = $('.bar1'),
        progressBarWrapper = progressBar.parent(),
        formContainer = $('.form-container')
        jumbotron = $('.jumbotron'),
        submit = $('#submit'),
        answer = $('.answer'),
        container = $('.container'),
        loading = $('.loading'),
        attempted = $('.attempted span'),
        right = $('.right span'),
        total = $('.total span'),
        wrong = $('.wrong span'),
        userName = $('.name span'),
        rollno = $('.rollno span'),
        testDate = $('.test-date span'),
        subject = $('.subject span')
        h4 = $('h4');
        h4.hide(),
        list = $('.dropdown ul li')
        caret = $('.caret')
        dropdownToggle = $('.dropdown-toggle');
        alert = $('.alert');
        errorAlert = $('.alert.error');
        
    var errMsg = {
        101: 'APP_SERVER_ERR',
        0 : 'TEST',
        1 : 'TEMP_FILE_SAVE_ERR',
        2 : 'WRONG_FILE_TYPE_UPLOADED_ERR',
        3 : 'TEMP_FILE_UNLINK_ERR',
        4 : 'TEMP_FILE_STAT_ERR:',
        5 : 'TEMP_FILE_PATH_NOT_FOUND_ERR',
        6 : 'TEMP_FILE_DIGESTION_ERR',
        7 : 'QUERY_ERR',
        8 : 'QUESTION_NOT_FOUND_ERR',
        9 : 'DATA_NOT_AVAILABLE_ERR',
        10 : 'USER_SEARCH_ERR',
        11 : 'QSET_NOT_AVAILABLE_ERR'
    }

    submit.click(function(event) {
        event.preventDefault();
        fileToData = $( 'input[type=file' )[0].files[0];
        
        
        // var stream = $( 'input[type=file' )[0].files[0]

        alert.addClass('hide');

        if (!fileToData) {
           h4.fadeIn(1000, function() {
            setTimeout(function(){
                h4.fadeOut(800);
            }, 1800)
                
            });
            return
        }
        //check if proper html file is uploaded
        if (fileToData.type !== 'text/html') {
            console.error('Please select Html File.');
            alert('Please select Html File.');
            return;
        }

        //verify data
        setTimeout(function(){
            formContainer.hide();
            loading.removeClass('hidden');
            loading.hide();
            loading.fadeIn('fast')
        },1000);

        var fd = new FormData();
        fd.append('ansFile', fileToData);
        // fd.append('ansFile', fileToData);
        digestFile(fileToData, function(digested){
          
           $.ajax({
                url: 'file/upload',
                data: digested,
                // processData: false,
                // contentType: json,
                type: 'POST',
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function(evt) {
                      if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        
                        // show progress
                        progressBar.width(percentComplete + '%');

                      }
                    }, false);

                    return xhr;
                },
                success: function ( data, status, xhr) {
                    // da = data;
                    var resStat = xhr.getResponseHeader("err");

                    if (!data.err && !resStat) {
                        formContainer.addClass('hide');

                        formContainer.animate({
                            opacity: 0,
                            visibility: 'hidden'
                        },
                        1000, function() {
                            // container.addClass('hide');
                            container.hide();
                            formContainer.detach();
                            alert.detach();
                            jumbotron.removeClass('hide');
                            loading.addClass('hide');



                            //extract user
                            var userData = data.userInfo;

                            userName.text(userData['name']);
                            rollno.text(userData['rollno']);
                            testDate.text(userData['examdate']);
                            subject.text(userData['subject']);


                            //attatch data to dom
                            var count = 1,
                                totalMarks = 0;
                            $.each(data.arr, function(index, el) {
                                answer.append(creatQuestion(el, index, count));
                                count++;
                            });        
                            //set the jumbo data
                            $(attempted[0]).text(data['qcount'] - data['nonAttempt']);
                            $(attempted[2]).text(data['qcount']);
                            right.text(data['right']);

                            totalMarks = Math.round( data['credit'] * 100 ) / 100;
                            total.text(totalMarks);
                            wrong.text(data['wrong']);
                            container.fadeIn('slow', function() {
                                
                            });
                        });
                    }else{
                        console.error(data.err, data.errCode);
                        loading.addClass('hide');
                        //show error msg to user
                        // alert('Please select proper file');
                        if (resStat) {
                            var errcode= xhr.getResponseHeader('errcode');
                            console.log(errcode);
                            
                            errorAlert.text(errMsg[errcode]);
                            errorAlert.removeClass('hide');
                            loading.addClass('hide');
                        }
                    }

                        
                }//end success

            });//end $.ajax
        });
       

        //show progress bar
        progressBarWrapper.removeClass('hidden');


    });//end click

    // $.each(list, function(index, el) {
    //     $(el).click(function(event) {
    //         caret.data('select', $(el).data('stream'));
    //         // dropdownToggle.text($(el + 'a').text());
    //         console.log($(el + 'a').text());
    //     });
    // });

});                 

function creatQuestion(obj, id, qno){
    var str = '';
    str = '<div class="col-6-md question">';


    if ((parseInt(id.toString().slice(-2)) > 90) || (id.toString().slice(-2) == '00')) {
        str+=       '<img class="question-img" name="585_664592_0_587434_cs2_q'+id.toString().slice(-2)+'.jpg" src="https://www.digialm.com:443//per/g01/pub/585/touchstone/TempQPImagesStoreNonSecured/adcimages/1454917673108/6645927///585_664592_0_587434_ga6_q0'+ id.toString().slice(-1) +'.jpg" alt="">';
    }else{
        str+=       '<img class="question-img" name="585_664592_0_587434_cs2_q'+id.toString().slice(-2)+'.jpg" src="https://www.digialm.com:443//per/g01/pub/585/touchstone/TempQPImagesStoreNonSecured/adcimages/1454917673108/6645927///585_664592_0_587434_cs2_q'+ id.toString().slice(-2) +'.jpg" alt="">';
    }


    str+=       '<div class="qno">'+  qno + '<div class="credit'+ ((obj['credit']===1)? 1:2)  + '">Marks '+  obj['credit'] + '</div></div>';
    str+=        '<div class="wrapper">';
    str+=            '<ul>';
    
        str+=               ' <li class="qid">QID : <strong>' + id +'</strong> </li>';
        str+=               '<li class="correct">Actual answer : <strong>'+ obj['answer'] +'</strong></li>';


        if (obj['type'] === 1) {
            str+=           '<li class="gans">Your answer (Selected) : '+ obj['ChosenOption']+'</li>';
        }else if (obj['type'] === 2) {
            str+=           '<li class="gans">Your answer (Given) : '+ obj['GivenAnswer'] +'</li>';
        }

        //show if right or wrong
        if (obj['status'] === 0) {
            str+=           '<li class="status skip"><span class="glyphicon glyphicon-minus" aria-hidden="true"></li>';
        }else if (obj['status'] === 1) {
            str+=           '<li class="status ok"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></li>';
        }else if (obj['status'] === -1) {
            str+=           '<li class="status ohh"><span class="glyphicon glyphicon-remove" aria-hidden="true"></li>';
        }

    str+=            '</ul>';
    str+=        '</div>';


    str+=    '</div>';

    return $(str);
}


/*
|--------------------------------------------------------------------------
| Data digestion have to be done locally.....
|--------------------------------------------------------------------------
*/

function readFile(file, cb){
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            if ($.isFunction(cb)) {
                cb(evt.target.result);
            }
        }
        reader.onerror = function (evt) {
            console.error("error reading file");
        }
    }
}

function digestFile(fileToData, cb){
  var userInfo = {},
      digest = [];

  var fileRead;
  readFile(fileToData, function(fileDataString){
    //first remove img tags
    var content = fileDataString.replace(/<img[^>]*>/g,"");

    var $data = $(content);

    var answers = $data.find('table.menu-tbl');

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
         userEl= $data.find('.main-info-pnl').find('tbody').find('tr');
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

          var dataSend = {};
          for (var i = 0; i < digest.length; i++) {
             
            if (digest[i]['GivenAnswer']) {
              dataSend[digest[i]['QuestionID']] = {GivenAnswer: digest[i]['GivenAnswer']};
            }else{
              dataSend[digest[i]['QuestionID']] = {ChosenOption: digest[i]['ChosenOption']};
            }
          }

          if (dataSend && userInfo) {
            if ($.isFunction(cb)) {
                var SEND_DATA  = {data: dataSend, userInfo:userInfo};

                var dd = JSON.stringify(SEND_DATA);
                // db = SEND_DATA;
                // cb(JSON.stringify(SEND_DATA));
                cb({'DATA': dd});
            }
          }
    }
    }





  });//--------------------------------

}