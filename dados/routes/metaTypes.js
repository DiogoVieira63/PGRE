var express = require("express");
var router = express.Router();
var fs = require("fs");

const Curso = require("../controllers/curso");
const Type = require("../controllers/type");

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyAdmin = Permission.admin;




// new type request
router.post("/",verifyJWT,verifyAdmin, function (req, res, nxt){
  let type = {
    id: req.body.id,
    state: "active"
  }
  Type.insert(type).then((type) => {
    console.log("Type",type);
    res.jsonp({type});
  }).catch((err) => {
    console.log(err);
    res.status(500).jsonp({error: err});
  });
});




// get all types
router.get("/",verifyJWT, function (req, res, nxt){
  console.log("Get all types");
  Type.getAll().then((types) => {
    console.log("Types",types);
    res.jsonp({types});
  }).catch((err) => {
    console.log(err);
    res.status(500).jsonp({error: err});
  });
});

router.get("/active",verifyJWT, function (req, res, nxt){
  console.log("Get types A");
  Type.getActives().then((types) => {
    console.log("Types",types);
    res.jsonp(types);
  }).catch((err) => {
    console.log(err);
    res.status(500).jsonp({error: err});
  });
});






module.exports = router;
