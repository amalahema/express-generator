const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will add the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
    res.end("Will update the promotion: " +  req.body.name +  " with details: " +  req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
})
.delete((req, res, next) => {
    res.end('Deleting all promotion');
});

promotionRouter.route('/:promotionid')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
        res.end("Will send the promotions" + req.params.promotionid + ' to you!');
    })
.post((req, res, next) => {
    res.end("Post operation not supported on /promotion/" + req.params.promotionid); 
    })
.put((req, res, next) => {
    res.statusCode = 403;
    res.write("Updating the details of promotion: " + req.params.promotionid + '\n');
    res.end("Will update the promotion: " +  req.body.name +  " with details: " +  req.body.description);
    })
.delete((req, res, next) => {
     res.end('Deleting the promotion details: ' + req.params.promotionid);
    })
module.exports =promotionRouter;