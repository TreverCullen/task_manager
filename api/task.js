var express = require('express');
var router = express.Router();
var db = require('./fire').db;

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

//////////////////////
// return all tasks //
//////////////////////
router.get('/', function(req, res) {
    var uid = req.query.uid;
    var board = req.query.board;

    if (uid == 'undefined')
        res.status(400).json({error: 'Undefined User'});
    else if (board == 'undefined')
        res.status(400).json({error: 'New User'});

    else{
        ref = db.ref('/tasks/' + board);
        ref.once('value').then(function(snap){
            res.json(snap.val());
        });
    }
});

/////////////////
// create task //
/////////////////
router.post('/', function(req, res) {
    var uid = req.query.uid;
    var board = req.query.board;

    if (uid == 'undefined')
        res.status(400).json({error: 'Undefined User'});
    else if (board == 'undefined')
        res.status(400).json({error: 'Undefined Board'});

    // function callback(board){
    //     if (board){
    //         ref('tasks/' + board).push(req.data);
    //     }
    //     else res.json({message: 'Failed to Create Task - No Board'});
    // }
});

//////////////////////
// return task <id> //
//////////////////////
router.get('/:id', function(req, res) {
    var uid = req.query.uid;
    var board = req.query.board;
    var id = req.params.id;

    if (uid == 'undefined')
        res.status(400).json({error: 'Undefined User'});
    else if (board == 'undefined')
        res.status(400).json({error: 'Undefined Board'});

    else{
        ref = db.ref('/tasks/' + board + '/' + id);
        ref.once('value').then(function(snap){
            res.json(snap.val());
        });
    }
});

//////////////////////
// update task <id> //
//////////////////////
router.post('/:id', function(req, res) {
    var uid = req.query.uid;
    var board = req.query.board;
    var id = req.params.id;

    if (uid == 'undefined')
        res.status(400).json({error: 'Undefined User'});
    else if (board == 'undefined')
        res.status(400).json({error: 'Undefined Board'});

    else{
        ref = db.ref('/tasks/' + board + '/' + id);
        ref.update(req.body);
        res.json(req.body);
    }
});

//////////////////////
// delete task <id> //
//////////////////////
router.delete('/:id', function(req, res){
    var uid = req.query.id;
    var board = req.query.board;
    var id = req.params.id;

    if (uid == 'undefined')
        res.status(400).json({error: 'Undefined User'});
    else if (board == 'undefined')
        res.status(400).json({error: 'Undefined Board'});

    else{
        ref = db.ref('/tasks/' + board + '/' + id);
        ref.set(null);
        res.json({message: 'Task ' + id + ' deleted'});
    }
});


module.exports = router;
