var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema
var ChatUserSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String, 
        index: true
    },
    password: {
        type:String
    }
});

var User = module.exports = mongoose.model('User', ChatUserSchema);

module.exports.createUser = function(newUser, callbackFunction) {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callbackFunction);
    });
});
}