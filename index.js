var express = require('express')
var app = express()

app.get('/',function(req, res) {
    res.send('What\'s up, doc?')
})

app.listen(8080, function() {
    console.log('Magic is happening at localhost:8080')
})