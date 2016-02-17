var mongoose = require('mongoose');
var AnswerSchema = require('./Answer');

var AnsSet = new mongoose.Schema({
    stream:     { type: String},
    setno:     { type: Number},
    qcount:     { type: Number},
    answers:    [AnswerSchema],

    createdOn: { type: Date, default: Date.now },
    modifiedOn:  { type: Date, default: Date.now }
});

mongoose.model('AnsSet', AnsSet);
