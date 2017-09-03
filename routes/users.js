var express = require('express'),
    router = express.Router(),
//    { check, validationResult } = require('express-validator/check'),
//    { matchedData } = require('express-validator/filter'),
    User = require('../models/user');

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/login', function (req, res) {
    res.render('login');
});

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

module.exports = router;
