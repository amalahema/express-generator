var createError = require('http-errors');
var express = require('express');//express generator
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');//experss framework 
var usersRouter = require('./routes/users');//express framework
var dishRouter  = require('./routes/dishRouter');
var promotionRouter  = require('./routes/promotionRouter');
var leaderRouter  = require('./routes/leaderRouter');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const { signedCookies } = require('cookie-parser');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));//middleware( parses cookies attached to the client request object.)a secret key as the parameter here. The secret key could be any string there, so I'm just going to supply a string like this, I'll say 12345-67890. It doesn't have to be anything meaningful, it's just a key that can be used by our cookie-parser in order to encrypt the information and sign the cookie that is sent from the server to the client.
app.use(bodyParser.json());
function auth (req, res, next) {
  console.log(req.signedCookies);
  if (!req.signedCookies.user)
  {
    var authHeader = req.headers.authorization;//hold the authorization header from the client side
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');//extract the authorization header user and pass store in auth variable such as [0][1]
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
      res.cookie('user','admin', { signed: true })
      next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        return next(err);
    }
  }
 else
 {
   if(req.signedCookies.user === 'admin')
   {
     next();
   }
   else{
    var err = new Error('You are not authenticated!'); 
    err.status = 401;
    return next(err);
   }
 }
}
app.use(auth)
app.use(express.static(path.join(__dirname, 'public')));//enables us to serve static data from the public folder

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
