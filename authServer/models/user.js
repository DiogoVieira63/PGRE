var mongoose = require('mongoose');
const passport = require('passport');
var Schema = mongoose.Schema;
passportLocalMongoose = require('passport-local-mongoose');

var Affiliation = new Schema({
    university: String,
    department: String
})

var User = new Schema({
    username: String,
    password: String,
    level: String,
    active: Boolean,
    dateCreated: String,
    name: String,
    affiliation: Affiliation,
    registerDate: Date,
    lastAccessDate: Date
});


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', User);