var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html') 
});

var server = app.listen(port, function() {
    console.log('Listening on port ' + port)
});

var io = require('socket.io')(server);
io.on('connection', function(socket) {
    console.log('A user has connected!');
    
    socket.on('postMessageToServer', function(message) {
        console.log('Message received in server: ' + message);
       io.emit('addMessage', {message: message, id: socket.id}); //At some point, with user who submitted? 
    });
});
