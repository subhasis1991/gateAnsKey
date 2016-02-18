var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    util = require('./util'),
    ERR = require('./ERR');


module.exports = function saveUerData(ret){
  //if user data not already exists
  //save it

  var userInfo = ret.userInfo;
    if (userInfo) {
      var user = new User({
        name: userInfo.name,
        rollno: userInfo.rollno,
        total_marks: ret.credit,
        correct_question: ret.correct,
        wrong_question: ret.wrong,
        negative_marks: ret.negative,
        attempted: ret.attempted
      });

      user.findByRollNo(function(err, data){
        if (!err) {
          if (data.length===0) {
            //user does not exists so save data
            user.save();
          }else if (data.length !==0) {
            //user already exists
            util.log('User already exists in database');
          }
        }else{
          util.log('ERROR :' + ERR.USER_SEARCH_ERR);
        }
      });//find user
  }


}