var mongoose = require('mongoose');

module.exports = AnswerSchema = new mongoose.Schema({
    id:       { type: Number },
    answer:   { type: String },

    type:     { type: Number},
    qsetno:     { type: Number},
    stream:     { type: String},
    credit:     { type: Number},

    createdOn: { type: Date, default: Date.now },
    modifiedOn:  { type: Date, default: Date.now }
});

AnswerSchema.methods.findById = function findById (cb) {
  return this.model('Answer').find({id: this.id}, cb);
};



mongoose.model('Answer', AnswerSchema);
