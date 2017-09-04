//Requirements
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    exphd = require('express-handlebars'),
    expressValidator = require('express-validator/check'),
    favicon = require('serve-favicon'),
    flash = require('connect-flash'),
    Message = require('./models/message'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    path = require('path'),
    passport = require('passport'),
    port = process.env.PORT || 3000,
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy;

//Setting up db
mongoose.connect('mongodb://localhost/chatroomapp', function (err){
    if (err) throw err;
});
var db = mongoose.connection;

//Setting up server
var server = app.listen(port, function() {
        console.log('Listening on port ' + port)
        });
var io = require('socket.io')(server);

//Setting routes
var routes = require('./routes/index')
var users = require('./routes/users')
app.use(favicon(path.join(__dirname,'public','images','favicon.gif')));
app.use(express.static(path.join(__dirname, 'public')));

//Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphd({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//Middleware: Parsing, Validation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
    secret: 'My Secret',
    saveUninitialized: true, 
    resave: true
}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Set up passport
app.use(passport.initialize());
app.use(passport.session());

io.on('connection', function(socket) {
    console.log('A user has connected!');
    var query = Message.find({});
    query.sort('timeStamp').exec(function (err, docs) {
        if (err) throw err;
        console.log('Emitting old messages.');
        socket.emit('loadOldMessages', docs);
    });
    
    socket.on('postMessageToServer', function(data) {
        console.log('Message received in server: ' + data.message + ' from: ' + data.username);
        var newMessage = new Message({username: data.username, message: data.message});
        newMessage.save(function (err) {
            if (err) throw err;
            io.emit('addMessage', {username: data.username, message: data.message, timeStamp: newMessage.timeStamp});
        })
    });
});

app.use('/', routes);
app.use('/users', users);
