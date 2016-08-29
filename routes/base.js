var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});


router.get('/tasks', function(req, res) {
	res.render('tasks');
});

router.get('/login', function(req, res) {
	res.render('login');
});


module.exports = router;
