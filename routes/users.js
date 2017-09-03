var express = require('express'),
    router = express.Router(),
//    { check, validationResult } = require('express-validator/check'),
//    { matchedData } = require('express-validator/filter'),
    User = require('../models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

//Get Routes
router.get('/register', ensureNotAuthenticated, function (req, res) {
    res.render('register');
});

router.get('/login', ensureNotAuthenticated, function (req, res) {
    res.render('login');
});

router.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/');
});

//Post Routes
router.post('/register', function (req, res, next) {
    var name = req.body.name,
        username = req.body.username,
        password = req.body.password[0],
        password2 = req.body.password[1];
    
//    //Validate failing for right now, figure out in later iteration    
//    const errors = validationResult(req).throw();
//    console.log(errors);
//    
//    if (!errors.isEmpty()) {
//        return res.status(422).json({ errors: err.mapped() });
//    }
    
    var newUser = new User({name: name, username: username, password: password});
    User.createUser(newUser, function (err, user) {
        if (err) {throw err; }
        console.log(user);
    });
    
    req.flash('success_msg', 'You have succesfully registered! Login to continue.');
    res.redirect('/users/login');
});


//Passport.js Strategy, Serialization, and Login Authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
          if (err) throw err;
          if(!user) {
              return done(null, 'false', {message:'Unknown User'});
          }
          User.comparePassword(password, user.password, function(err, isMatch) {
              if(err) throw err;
              if(isMatch) {
                  return done(null, user);
              } else {
                  return done(null, false, {message: 'Invalid Password'});
              }
          });
      });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/chat',
                                                    failureRedirect: '/users/login', failureFlash: true }));

//Ensure Authentication exists before logout
function ensureAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in yet. Please register/login and try again.');
        res.redirect('/users/login');
    }
}

//Ensure not Authenticated before login/register
function ensureNotAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        req.flash('error_msg', 'You are already logged in. If you want to switch users, click Logout to continue.');
        res.redirect('/chat');
    } else {
        return next();
    }
}

module.exports = router;