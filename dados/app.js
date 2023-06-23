var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");



require('dotenv').config({path: '../.env'})


var mongoose = require("mongoose");
var mongoDB = "mongodb://127.0.0.1/PGRE";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
var Grid = require("gridfs-stream");

db.on("error", function () {
  console.log("MongoDB connection error:");
  process.exit(1);
});
var gfs;
db.on("open", function () {
  gfs = new mongoose.mongo.GridFSBucket(db.db);
  console.log("MongoDB connection ok!");
});



var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(function(req, res, next) {
  console.log(req.cookies)
  console.log(req.headers)
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials","true");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
   }
   else {
     next();
   }});



app.use(function (req, res, next) {
  req.gfs = gfs;
  next();
});

var metaFilesRouter = require("./routes/metaFiles");
var metaTypesRouter = require("./routes/metaTypes.js");
var cursosRouter = require("./routes/cursos");
var noticiasRouter = require("./routes/noticias");


app.use("/meta/files", metaFilesRouter);
app.use("/meta/types", metaTypesRouter);
app.use('/cursos',cursosRouter);
app.use('/noticias',noticiasRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
