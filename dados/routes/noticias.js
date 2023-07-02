var express = require("express");
var router = express.Router();
var fs = require("fs");


const Noticia = require("../controllers/noticia");
const Curso = require("../controllers/curso");


const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyCourse = Permission.course;

/*
const notificationSchema = new mongoose.Schema({
    "descricao": String,
    "link": String,
})


const pedidoSchema = new mongoose.Schema({
    "tipo": String,
    "feitoPor": String,
    "info": String,
})


const noticiasSchema = new mongoose.Schema({
    "username" : String,
    "notificacao": [notificationSchema],
    "pedido": [pedidoSchema]
})
*/


// create
router.post("/",function (req, res, nxt) {
    console.log(req.body)
    var noticia = {
        username : req.body.username,
        pedido: [],
        notificacao: [{
            lida: false,
            descricao: "Bem vindo!",
        }]
    }
    Noticia.insert(noticia)
        .then((noticia) => {
            console.log("Noticia criada");
            res.status(201).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).jsonp({error: err});
    });
});

router.post("/lida",/*verifyJWT,*/function (req, res, nxt) {
    Noticia.lida(req.body.username,req.body.id)
        .then((noticia) => {
            console.log("Noticia lida");
            res.status(201).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).jsonp({error: err});
        });
});

router.get("/getpedido",verifyJWT, function (req, res, nxt) {
    var username = req.user.username;
    var curso = req.query.curso
    Noticia.getCertainPedido(username,curso).then((noticia) => {
        res.status(200).jsonp(noticia);
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });
});

router.get("/",verifyJWT, function (req, res, nxt) {
    var username = req.user.username;
    Noticia.get(username).then((noticia) => {
        res.status(200).jsonp(noticia);
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });
});



function notificacaoCurso (curso,notificacao){
    console.log("Notificacao curso");

}



module.exports = router;
