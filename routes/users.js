
var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var router = express.Router();
router.use(bodyParser.json());
var authenticate = require('../authenticate');
const cors = require('./cors');
/* GET users listing. 
router.get('/', function(req, res, next)
 {
  res.send('respond with a resource');
 });*/
 router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader('Content_type', 'application/json');
      res.json(users);
    }
  })
});


//End point signup mounted with router
//New User Registeration
//1.Check the username is already exists or not
//2.If it not null e.x if the name already in the database it displays an err 
//2.Otherwise send a promise to user to regoster their username into dadabase
router.post('/signup', cors.corsWithOptions, (req, res, next) => 
{
  User.register(new User({username: req.body.username}), //if the username of the incoming request is already exist in the system does not allow
    req.body.password, (err, user) => 
  {
    if(err) 
    {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: err});
    }
    else 
    {   
      if(req.body.firstname) 
        user.firstname = req.body.firstname;
      if(req.body.lastname) 
        user.lastname = req.body.lastname;  
      user.save((err,user) => {
        if(err)
        {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req,res, () =>  {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });                                    //not duplicate entry it will accept and  create a new signin
      
    }
  });
 
});
//End Point Login
//1.Username authorization(retrieve and check)
//2.Fetch the username and password details
//3.Find the avilability of the username & password in the database
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => 
{
  
  
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
  
});
//logout endpoint
//no neeed to use post method bec we not supply any information to system
router.get('/logout', cors.corsWithOptions,  (req, res) => {
  if (req.session) {                    //if the user session is exists 
    req.session.destroy();              //delete cookies of the client side
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
