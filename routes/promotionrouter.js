const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
const Promotions = require('../models/promotions');//schema 
var authenticate = require('../authenticate');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((_req,res,next) => 
{                                
    Promotions.find({})
    .then((promotions) => 
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);                              
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => 
{
    Promotions.create(req.body)                             
    .then((promotion) =>     //one promotion added to the promotions
    {
        console.log('Promotions added', promotion);             
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => 
{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) =>
 {
    Promotions.remove({})
    .then((resp) => 
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


promotionRouter.route('/:promotionId')
.get((req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);//return as a json document
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.promotionId);
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId, {    
        $set: req.body                                 
    }, { new: true })                                
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);                                 
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promotionRouter;
