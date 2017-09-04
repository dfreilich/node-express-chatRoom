var mongoose = require('mongoose');

//Message Schema
var messageSchema = mongoose.Schema({
    username: {
        type: String
    },
    message: {
        type: String
    },
    timeStamp: {
        type: Date, 
        default: Date.now
    }
})

var Message = module.exports = mongoose.model('Message', messageSchema);