var mongoose = require('mongoose');
 
module.exports  = UserSchema= new mongoose.Schema({
    name: String,
    rollno: String,
    total_marks: Number,
    wrong_question: Number,
    correct_question: Number,
    negative_marks: Number,
    attempted: Number
});

UserSchema.methods.findByRollNo = function findByRollNo (cb) {
  return this.model('User').find({rollno: this.rollno}, cb);
};

mongoose.model('User', UserSchema);