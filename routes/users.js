var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var router = express.Router();
router.use(bodyParser.json());


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
router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})//if the username of the incoming request is already exist in the system does not allow
  //Promises of the result
  .then((user) => //return the user
  {
    if(user != null) 
    {
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    else 
    {                                     //not duplicate entry it will accept and  create a new signin
      return User.create
      ({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user) => {                     //return a promise to user
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))                //if the above promise does not satisfy it moves to error message
  .catch((err) => next(err));
});
//End Point Login
//1.Username authorization(retrieve and check)
//2.Fetch the username and password details
//3.Find the avilability of the username & password in the database
router.post('/login', (req, res, next) => {

  if(!req.session.user) {              
    var authHeader = req.headers.authorization;
    //if the user is not an autheticated 
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    //Retrieve the username and passsword from the header
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    User.findOne({username: username})//(stored in user database username:incoming username)
    .then((user) => {
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})
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
