var express = require("express");
var router = express.Router();
var jsonFile = require("jsonfile");
var fs = require("fs");

const url = "mongodb://127.0.0.1/PGRE";
const Meta = require("../controllers/meta");

const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');


function verifyJWT(req, res, next){
  console.log("Cookies",req.cookies);
  var token = req.cookies.token;
  console.log("Token",token);
  jwt.verify(token, process.env.JWT_KEY,{
    expiresIn: '1d'
  },function(err, decoded) {
    if (err) {
      console.log("Failed",err);
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    // pass decoded to next middleware
    req.user = decoded;
    next();
  });
}

router.post("/files",verifyJWT,function (req, res, nxt){
  var file = req.body.file;
  console.log(file);
  var body = req.body.body;
  console.log(body);
  var meta = {
    id: file.filename,
    date: new Date().toISOString().substring(0, 19),
    level: body.level,
    name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    description: body.description,
  }
  console.log(meta);
  Meta.insert(meta)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});


router.get("/files",verifyJWT, function (req, res) {
    var d = new Date().toISOString().substring(0, 19);
    console.log("User",req.user);
    var level = req.user.level;
    Meta.getAll(level).then((data) => {
      res.jsonp({lista : data, user: req.user});
    }).catch((err) => {
      console.log(err);
      res.status(500).jsonp({error: err});
    });


});


router.get("/files/:id", function(req, res, nxt){
  Meta.getOne(req.params.id).then((meta) => {
    let mimetype = meta.mimetype;
    const readStream = req.gfs.openDownloadStream(new ObjectId(req.params.id));
    readStream.on("error", function(err){
      nxt(err);
    });
    console.log("mimetype: " + mimetype);
    res.set("Content-Type", mimetype);
    readStream.pipe(res);
  }).catch((err) => {
    nxt(err);
  });
});


module.exports = router;
