var express = require("express");
var router = express.Router();
var jsonFile = require("jsonfile");
var fs = require("fs");

const url = "mongodb://127.0.0.1/PGRE";
const Curso = require("../controllers/curso");

const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

  
function verifyJWT(req, res, next){
  var token = req.query.token;
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

router.post("/create",verifyJWT,function (req, res, nxt) {
    var curso = req.body.curso;
    var username = req.user.username;
    Curso.insert(curso,username)
    .then((curso) => {
        res.status(201).jsonp(curso);
    }).catch((err) => {
        nxt(err);
    });
});

router.get("/",verifyJWT,function (req, res) {
    Curso.getAll().then((data) => {
        console.log("Cursos",data);  
        res.jsonp(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});

module.exports = router;
