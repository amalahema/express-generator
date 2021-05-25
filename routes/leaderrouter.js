const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leader details to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders');
});

leaderRouter.route('/:leaderid')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
        res.end("Sending the details of Leader: " + req.params.leaderid + ' to you!');
    })
.post((req, res, next) => {
    res.end("post operation not supported on /leader/"+ req.params.leaderid)
    })
.put((req, res, next) => {
    res.statusCode = 403;
    res.write("Updating the details of Leader: " + req.params.leaderid + '\n');
    res.end("Will update the Leader: " +  req.body.name + "with details:" +  req.body.description);
    })
.delete((req, res, next) => {
        res.end('Deleting the Leader details: ' + req.params.leaderid);
    })
module.exports = leaderRouter;