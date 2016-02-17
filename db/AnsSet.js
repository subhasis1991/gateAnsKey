var mongoose = require('mongoose');
var AnswerSchema = require('./Answer');

var AnsSetSchema = new mongoose.Schema({
    stream:     { type: String},
    qsetno:     { type: Number},
    qcount:     { type: Number},
    answers:    [AnswerSchema],

    createdOn: { type: Date, default: Date.now },
    modifiedOn:  { type: Date, default: Date.now }
});


// AnsSetSchema.methods.findAnsSetForStream = function findAnsSetForStream (cb) {
//   return this.model('AnsSet').find({stream:'cse', qSet: 1}, cb);
// };

AnsSetSchema.methods.findByStreamQset = function findById (cb) {
  return this.model('AnsSet').find({stream: this.stream, qsetno: this.qsetno}, cb);
};


mongoose.model('AnsSet', AnsSetSchema);

