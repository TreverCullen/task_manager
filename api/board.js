var express = require('express');
var router = express.Router();
var db = require('./fire').db;

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

///////////////////////
// return all boards //
///////////////////////
router.get('/', function(req, res) {
    var uid = req.query.uid;

    if (uid == 'undefined')
        res.status(400).json({error: 'Undefined User'});

    else{
        ref = db.ref('/users/'+uid+'/boards');
        ref.once('value').then(function(snap){
            res.json(snap.val());
        });
    }
});


///////////////////////
// return board <id> //
///////////////////////
// router.get('/', function(req, res) {
//     var uid = req.query.uid;
//     var board = req.query.board;
//
//     if (uid == 'undefined')
//         res.status(400).json({error: 'Undefined User'});
//     else if (board == 'undefined')
//         res.status(400).json({error: 'Undefined Board'});
//
//     else{
//         ref = db.ref('/boards/'+uid+'/boards/'+);
//         ref.once('value').then(function(snap){
//             res.json(snap.val());
//         });
//     }
// });

module.exports = router;

