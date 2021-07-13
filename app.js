//Run the database and server(postman)->enter username and password as a json input
//C:\Users\amala\Coursera\mongodb>mongod --dbpath=data --bind_ip 127.0.0.1
var createError = require('http-errors');
var express = require('express');//express generator
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var authenticate = require('./authenticate');
var FileStore = require('session-file-store')(session);
var config = require('./config');

var indexRouter = require('./routes/index');//experss framework 
var usersRouter = require('./routes/users');//express framework
var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const { signedCookies } = require('cookie-parser');
const url = config.mongoUrl;

const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();
//Secure Traffic Only
app.all('*',(req,res,next) => 
{
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);//req.url is the rest of the path name
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
//User can acces only this webpage without login so passport node module initialized
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));//enables us to serve static data from the public folder

app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
