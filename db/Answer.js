var mongoose = require('mongoose');

module.exports = Answer = new mongoose.Schema({
    id:       { type: Number },
    answer:   { type: String },
    type:     { type: String},
    qSet:     { type: String},
    stream:     { type: String},
    credit:     { type: Number},

    createdOn: { type: Date, default: Date.now },
    modifiedOn:  { type: Date, default: Date.now }
});

mongoose.model('Answer', Answer);
