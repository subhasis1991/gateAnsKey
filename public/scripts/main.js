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
            

    submit.click(function(event) {
        event.preventDefault();
        var fileData = $( 'input[type=file' )[0].files[0];
        
        console.log(fileData);
        // var stream = $( 'input[type=file' )[0].files[0]

        if (!fileData) {
           h4.fadeIn(1000, function() {
            setTimeout(function(){
                h4.fadeOut(800);
            }, 1800)
                
            });
            return
        }
        //check if proper html file is uploaded
        if (fileData.type !== 'text/html') {
            console.error('Please select Html File.');
            alert('Please select Html File.');
            return;
        }

        //verify data
        setTimeout(function(){
            loading.removeClass('hidden');
            loading.hide();
            loading.fadeIn('fast')
        },1000);

        var fd = new FormData();
        fd.append('ansFile', fileData);
        // fd.append('ansFile', fileData);

        $.ajax({
            url: 'file/upload',
            data: fd,
            processData: false,
            contentType: false,
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
                da = data;
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
                        console.log(xhr.getResponseHeader('errcode'));
                    }
                }

                    
            }//end success

        });//end $.ajax

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
