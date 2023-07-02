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


router.get("/pedidos",verifyJWT, function (req, res, nxt) {
    var username = req.user.username;
    var curso = req.body.curso
    Noticia.getPedidos(username,curso).then((noticia) => {
        res.status(200).jsonp(noticia);
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });
});


router.post("/pedidos/:id/resposta",verifyJWT, function (req, res, nxt) {
    let username = req.user.username;
    let id = req.params.id;
    let resposta = req.body.resposta == "true" ? true : false;
    Noticia.getOnePedido(username,id).then((pedido) => {
        console.log(pedido);
        if (pedido.tipo == 'pedido'){
            console.log("Entrar curso");
            let user = pedido.feitoPor;
            let curso = pedido.curso;
            if (resposta == true){
                Curso.addAluno(curso,user).then((curso) => {
                    Noticia.resposta(username,id,resposta).then((noticia) => {
                        let notificacao = {
                            "descricao": `O seu pedido para entrar no curso ${curso.nome} foi aceite.`,
                            "lida": false,
                            "link": `/cursos/${curso._id}`,
                        }                
                        Noticia.insertNotificacao(user, notificacao)
                        .then((notificacao) => {
                            console.log("Notificacao adicionada com sucesso");
                            res.status(201).jsonp(curso);
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).jsonp({error: err});
                        });
                    }).catch((err) => {
                        res.status(500).jsonp({error: err});
                    });
                }).catch((err) => {
                    res.status(500).jsonp({error: err});
                });
            }
        }
        else if (pedido.tipo == 'criarCurso'){
            console.log("Criar curso", resposta);
            let user = pedido.feitoPor;
            let curso = pedido.curso;
            if (resposta == true){
                console.log("Approve curso");
                Curso.aprovarCurso(curso).then((data) => {
                    console.log("Curso aprovado");
                    Noticia.resposta(username,id,resposta).then((noticia) => {
                        let notificacao = {
                            "descricao": `O seu pedido para criar o curso ${curso.nome} foi aceite.`,
                            "lida": false,
                            "link": `/cursos/${curso._id}`,
                        }                
                        Noticia.insertNotificacao(user, notificacao)
                        .then((notificacao) => {
                            console.log("Notificacao adicionada com sucesso");
                            res.status(201).jsonp(curso);
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).jsonp({error: err});
                        });
                    }).catch((err) => {
                        res.status(500).jsonp({error: err});
                    });
                }).catch((err) => {
                    console.log("Erro a aprovar curso");
                    res.status(500).jsonp({error: err});
                });
            }
        }


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


router.post("/notificacoes",verifyJWT, function (req, res, nxt) {
    console.log(req.body);
    var username = req.user.username;
    let notificacao = {
        "descricao": req.body.descricao,
        "lida": false,
        "link": req.body.link,
    };
    Noticia.notifyAll(notificacao).then((noticia) => {
        console.log("Notificacao adicionada com sucesso");
        res.status(200).jsonp(noticia);
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});







module.exports = router;
