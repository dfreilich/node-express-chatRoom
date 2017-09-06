//Requirements
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    exphd = require('express-handlebars'),
    expressValidator = require('express-validator/check'),
    favicon = require('serve-favicon'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local').Strategy,
    Message = require('./models/message'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    path = require('path'),
    passport = require('passport'),
    port = process.env.PORT || 3000,
    session = require('express-session');

//Setting up db
mongoose.connect('mongodb://localhost/chatroomapp', function (err) {
    if (err) { throw err; }
});
var db = mongoose.connection;

//Setting up server
var server = app.listen(port, function () {console.log('Listening on port ' + port); });
var io = require('socket.io')(server);

//Setting routes
var routes = require('./routes/index');
var users = require('./routes/users');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.gif')));
app.use(express.static(path.join(__dirname, 'public')));

//Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphd({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//Middleware: Body Parsing, Validation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Sets up Express Session, to store Session
app.use(session({
    secret: 'My Secret',
    saveUninitialized: true,
    resave: true
}));

//Sets up Flash message Middleware, to allow clear success/error messaging
app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //Needed flash message for Express
    res.locals.user = req.user || null; //Saves user data
    next();
});

//Set up passport, to save login information with the session
app.use(passport.initialize());
app.use(passport.session()); //Changes user value from session id to deserialized user object

io.on('connection', function (socket) {
    console.log('A user has connected!');
    var query = Message.find({});
    query.sort('timeStamp').exec(function (err, docs) {
        if (err) { throw err; }
        console.log('Emitting old messages.');
        socket.emit('loadOldMessages', docs);
    });
    
    socket.on('postMessageToServer', function (data) {
        console.log('Message received in server: ' + data.message + ' from: ' + data.username);
        var newMessage = new Message({username: data.username, message: data.message});
        newMessage.save(function (err) {
            if (err) { throw err; }
            io.emit('addMessage', {username: data.username, message: data.message, timeStamp: newMessage.timeStamp});
        });
    });
});

app.use('/', routes);
app.use('/users', users);
