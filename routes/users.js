
var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var router = express.Router();
router.use(bodyParser.json());


/*router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});*/





/* GET users listing. */
router.get('/', function(req, res, next)
 {
  res.send('respond with a resource');
 });

//End point signup mounted with router
//New User Registeration
//1.Check the username is already exists or not
//2.If it not null e.x if the name already in the database it displays an err 
//2.Otherwise send a promise to user to regoster their username into dadabase
router.post('/signup', (req, res, next) => 
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
    {                                     //not duplicate entry it will accept and  create a new signin
      passport.authenticate('local')(req,res, () =>  {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
 
});
//End Point Login
//1.Username authorization(retrieve and check)
//2.Fetch the username and password details
//3.Find the avilability of the username & password in the database
router.post('/login', passport.authenticate('local'), (req, res) => 
{
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
  
});
//logout endpoint
//no neeed to use post method bec we not supply any information to system
router.get('/logout', (req, res) => {
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
