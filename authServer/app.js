var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const OauthStrategy = require('passport-oauth2').Strategy;



var session = require('express-session');
const { v4: uuid } = require('uuid');
require('dotenv').config({path: '../.env'})

var mongoose = require('mongoose');
var mongoDB = "mongodb://127.0.0.1/PGRE";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', function(){
  console.log('MongoDB connection error:')
  process.exit(1);
  });
db.on('open', function () {
  console.log('MongoDB connection ok!');
});


var authRouter = require('./routes/auth');


var app = express();


app.use(session({
  genid: req => {
    return uuid();
  },
  secret: 'rpcw2023',
  resave: false,
  saveUninitialized: true
}))

//Configuração passport
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());



app.use('/', authRouter);



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
  res.jsonp({error: err.message});
});



module.exports = app;
