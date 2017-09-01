var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var server = app.listen(port, function() {
        console.log('Listening on port ' + port)
        });
var io = require('socket.io')(server);
var favicon = require('serve-favicon'),
    path = require('path');
app.use(favicon(path.join(__dirname,'public','images','favicon.gif')));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html') 
});



io.on('connection', function(socket) {
    console.log('A user has connected!');
    
    socket.on('postMessageToServer', function(message) {
        console.log('Message received in server: ' + message);
       io.emit('addMessage', {message: message, id: socket.id}); //At some point, with user who submitted? 
    });
});
