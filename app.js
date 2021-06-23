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

var indexRouter = require('./routes/index');//experss framework 
var usersRouter = require('./routes/users');//express framework
var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');

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
app.use(bodyParser.json());
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
//User can acces only this webpage without login so passport node module initialized
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
//check the user is authorized
function auth(req, res, next) {
  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }

}

app.use(auth)
app.use(express.static(path.join(__dirname, 'public')));//enables us to serve static data from the public folder
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

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
