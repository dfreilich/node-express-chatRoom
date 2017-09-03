var express = require('express'),
    router = express.Router();

console.log('entered index.js route file');
router.get('/', function(req, res) {
    res.render('index')
});

router.get('/chat', function(req, res) {
    res.render('chat')
});

module.exports = router;