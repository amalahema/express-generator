var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//These two functions they serialize user and deserialize 
//user are provided on the user schema and model by the use of the passport-local-mongoose plugin here