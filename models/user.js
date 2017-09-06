var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

//User Schema
var ChatUserSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type:String,
        required: true
    }
});

ChatUserSchema.plugin(uniqueValidator);

var User = module.exports = mongoose.model('User', ChatUserSchema);

//Hashes password, and then creates user with the hashed password.
module.exports.createUser = function(newUser, callbackFunction) {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callbackFunction);
    });
});
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(possiblePassword, hash, callback) {
    bcrypt.compare(possiblePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}


