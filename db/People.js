var mongoose = require('mongoose');

var Person = new mongoose.Schema({
    name:       { type: String },
    age:   { type: Number },

    createdOn: { type: Date, default: Date.now },
    modifiedOn:  { type: Date, default: Date.now }
});

mongoose.model('Person', Person);


