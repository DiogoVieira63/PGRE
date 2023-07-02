var express = require("express");
var router = express.Router();
var fs = require("fs");

const Universidade = require("../controllers/universidade");

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyAdmin = Permission.admin;




router.get("/",function (req, res, nxt){
    Universidade.getAll().then((universidades) => {
        console.log("Universidades",universidades);
        res.jsonp({universidades});
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});


module.exports = router;
