var express = require('express'),
    router = express.Router();

console.log('entered index.js route file');
router.get('/', function(req, res) {
    res.render('index')
});

router.get('/chat', ensureAuthenticated, function(req, res) {
    res.render('chat')
});

function ensureAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in.');
        res.redirect('/users/login');
    }
}
module.exports = router;
