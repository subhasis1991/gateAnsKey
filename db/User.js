var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    username: String,
    password: String,
    email: String,
    gender: String,
    stream: String,
    date_of_exam: String
});