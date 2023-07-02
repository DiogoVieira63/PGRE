var express = require("express");
var router = express.Router();
var jsonFile = require("jsonfile");
var fs = require("fs");

const url = "mongodb://127.0.0.1/PGRE";
const Curso = require("../controllers/curso");
const Noticia = require("../controllers/noticia");

const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyCourse = Permission.course;


router.get("/",verifyJWT,function (req, res) {
    Curso.getAll().then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});

router.get("/user",verifyJWT,function (req, res) {
    Curso.findByAluno(req.query.username).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});

router.get("/meuscursos",verifyJWT,function (req, res) {
    console.log(req.user)
    if (req.user.level == "aluno"){
        Curso.findByAluno(req.user.username).then((data) => {
            console.log("Cursos",data);  
            res.jsonp(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).jsonp({error: err});
        });
    }
    else if (req.user.level == "professor"){
        Curso.findByProfessor(req.user.username).then((data) => {
            console.log("Cursos",data);  
            res.jsonp(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).jsonp({error: err});
        });
    }
    // Curso.getAll().then((data) => {
    //     console.log("Cursos",data);  
    //     res.jsonp(data);
    // }).catch((err) => {
    //     console.log(err);
    //     res.status(500).jsonp({error: err});
    // });
});

router.get("/profile",verifyJWT,function (req, res, nxt) {
    console.log(req.user.username)
    if (req.user.level == "aluno"){
        Curso.findByAluno(req.user.username).then((cursos) => {
            console.log("CURSOS: "+cursos)
            console.log("USER: "+req.user)
            Noticia.get(req.user.username).then((noticias) => {
                res.status(200).jsonp({cursos: cursos, noticias: noticias, user: req.user});
            }).catch((err) => {
                res.status(500).jsonp({error: err});
            });
        }
        ).catch((err) => {
            res.status(500).jsonp({error: err});
        });
    }
    else{
        Curso.findByProfessor(req.user.username).then((cursos) => {
            console.log("CURSOS: "+cursos)
            console.log("USER: "+req.user)
            Noticia.get(req.user.username).then((noticias) => {
                res.status(200).jsonp({cursos: cursos, noticias: noticias, user: req.user});
            }).catch((err) => {
                res.status(500).jsonp({error: err});
            });
        }
        ).catch((err) => {
            res.status(500).jsonp({error: err});
        });
    }
});


router.get("/:curso/posts/:post"/*,verifyJWT,verifyCourse*/,function (req, res, nxt) {
    var curso = req.params.curso;
    var post = req.params.post;
    // var username = req.user.username;
    Curso.getOnePost(curso,post)
    .then((curso) => {
        res.status(201).jsonp(curso);
    }).catch((err) => {
        nxt(err);
    });
  });


// verificar se é prof?
router.post("/:curso/addpost",verifyJWT/*,verifyProfessor*/,function (req, res, nxt) {
    var cursoId = req.params.curso;
    var post = req.body;
    // var username = req.user.username;
    console.log("BODY:",req.body)
    Curso.addPost(cursoId,post)
    .then((curso) => {
        
        Curso.getOne(cursoId).then((curso) => {
            post = curso.posts[curso.posts.length-1];
            let notificacao = {
                "descricao": `${post.title}: ${post.description}`,
                "lida": false,
                "link": `/cursos/${cursoId}/posts/${post._id}`,
            }
            for (var i = 0; i < curso.alunos.length; i++) {
    
              Noticia.insertNotificacao(curso.alunos[i], notificacao).then((notificacao) => {
                  console.log("Notificacao adicionada com sucesso");
              }).catch((err) => {
                  console.log(err);
                  res.status(500).jsonp({error: err});
              })
            }
          })
        res.status(201).jsonp(curso);
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });
  });
  

router.get("/:curso",verifyJWT,verifyCourse,function (req, res) {
    Curso.getOne(req.params.curso).then((data) => {
        res.jsonp({ curso: data, permission:req.permission});
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});

router.post("/create",verifyJWT,/*verifyProfessor,*/function (req, res, nxt) {
    var curso = req.body.curso;
    Curso.insert(curso,req.user.username)
    .then((curso) => {
        
        res.status(201).jsonp(curso);
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });
});

// removeStudent
router.delete("/:curso/removealuno",/*verifyJWT,verifyRegente*/function (req, res, nxt) {
  // remover metas que apenas pertencem a este curso, depois
  console.log("CENAS: ",req.query.aluno)
  Curso.removeAluno(req.params.curso, req.query.aluno)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});


router.delete("/:curso/removeprofessor/:profid",/*verifyJWT,verifyRegente*/function (req, res, nxt) {
  // remover metas que apenas pertencem a este curso, depois
  Curso.removeProfessor(req.params.curso, req.params.profid)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});


router.delete("/remove/:curso",/*verifyJWT,verifyRegente*/function (req, res, nxt) {
  // remover metas que apenas pertencem a este curso, depois
  Curso.removeCurso(req.params.curso)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

router.post("/:curso/:post/addcomment",verifyJWT,verifyCourse,function (req, res, nxt) {
  var curso = req.params.curso;
  var post = req.params.post;
  var comment = req.body.comment;
  var user = req.user.username;

  Curso.addCommentPost(curso,post,comment,user)
  .then((curso) => {
      console.log("CURSO: ", curso)
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

// VERIFICAR SE USER FEZ O COMENTARIO
router.post("/:curso/:post/:idcomment/editcomment",verifyJWT,verifyCourse,function (req, res, nxt) {
  console.log("OI")
  var curso = req.params.curso;
  console.log(curso)
  var post = req.params.post;
  console.log(post)
  var idcomment = req.params.idcomment;
  console.log(idcomment)
  console.log("body edit: ", req.body)
  var comment = req.body.comment;
  // var username = req.user.username;
  Curso.editCommentPost(curso,post,idcomment,comment)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});


router.delete("/:curso/:post/:idcomment/removecomment",verifyJWT,verifyCourse,function (req, res, nxt) {
  var curso = req.params.curso;
  var post = req.params.post;
  var idcomment = req.params.idcomment;
  // var username = req.user.username;
  Curso.removeCommentPost(curso,post,idcomment)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

router.post("/:curso/:post/edit"/*,verifyJWT,verifyProfessor*/,function (req, res, nxt) {
  var curso = req.params.curso;
  var idpost = req.params.post;
  var post = req.body;
  // var username = req.user.username;
  Curso.editPost(curso,idpost,post)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

router.post("/:curso/edit",verifyJWT,verifyCourse,verifyProfessor,function (req, res, nxt) {
    Curso.editCurso(req.params.curso,req.body).then((curso) => {
        res.status(201).jsonp(curso);
    }).catch((err) => {
        nxt(err);
    });

});


router.post("/:curso/entrar/confirmar",verifyJWT,function (req, res, nxt) {
    var nomeCurso = req.params.curso;
    var username = req.user.username;
    console.log("BODY: ", req.body)
    Curso.getOne(nomeCurso)
    .then((curso) => {
        if (curso.regente == username){
            Curso.addAluno(curso,req.body.feitoPor)
            .then((resp) => { 
                console.log("CONFIRMAR")

                Noticia.resposta(username, req.body._id, true)
                .then((not) => {
                    let notificacao = {
                        "descricao": `O seu pedido para entrar no curso ${curso.nome} foi aceite.`,
                        "lida": false,
                        "link": `/cursos/${curso._id}`,
                    }                
                    Noticia.insertNotificacao(req.body.feitoPor, notificacao)
                    .then((notificacao) => {
                        console.log("Notificacao adicionada com sucesso");
                        res.status(201).jsonp(curso);
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).jsonp({error: err});
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).jsonp({error: err});
                })
            }).catch((err) => {
                res.status(500).jsonp({error: err});
            });
        }
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });
});


router.post("/:curso/entrar/cancelar",verifyJWT,function (req, res, nxt) {
    var nomeCurso = req.params.curso;
    var username = req.user.username;
    console.log("BODY: ", req.body)
    
    Curso.getOne(nomeCurso)
    .then((curso) => {
        Noticia.resposta(username, req.body._id, false)
        .then((not) => {
            console.log(not)

            let notificacao = {
                "descricao": `O seu pedido para entrar no curso ${curso.nome} foi recusado.`,
                "lida": false
            }                
            Noticia.insertNotificacao(req.body.feitoPor, notificacao)
            .then((notificacao) => {
                console.log("Notificacao adicionada com sucesso");
                res.status(201).jsonp(curso);
            }).catch((err) => {
                console.log(err);
                res.status(500).jsonp({error: err});
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).jsonp({error: err});
        })
    }).catch((err) => {
        res.status(500).jsonp({error: err});
    });

});

router.post("/:curso/entrar/confirmar",verifyJWT,function (req, res, nxt) {
    var nomeCurso = req.params.curso;
    var username = req.user.username;

    Curso.getOne(nomeCurso)
    .then((curso) => {
        if (curso.regente == username){
            console.log("CONFIRMAR")
            let notificacao = {
                "descricao": `O seu pedido para entrar no curso ${curso.nome} foi aceite.`,
                "lida": false,
                "link": `/cursos/${cursoId}`,
            }
            Noticia.insertNotificacao(curso.alunos[i], notificacao).then((notificacao) => {
                console.log("Notificacao adicionada com sucesso");
            }).catch((err) => {
                console.log(err);
                res.status(500).jsonp({error: err});
            })

         

        }
        else if (curso.visibilidade == 'publico'){
            Curso.addAluno(curso,username)
            .then((curso) => {
                res.status(201).jsonp(curso);
            }).catch((err) => {
                nxt(err);
            });
        }
    }).catch((err) => {
        nxt(err);
    });

});


router.get("/:curso/entrar",verifyJWT,function (req, res, nxt) {
    var curso = req.params.curso;
    var username = req.user.username;

    Curso.getOne(curso)
    .then((curso) => {
        if (curso.visibilidade == 'privado'){
            console.log("PRIVADO")
            let pedido = {
                "tipo": 'pedido',
                "feitoPor": username,
                "info": `O utilzador ${username} solicitou a entrada no curso ${curso.nome}.`,
                "respondido": false,
                "aceite":false,
                "curso": curso._id
            }

            Noticia.insertPedido(curso.regente, pedido).then((notificacao) => {
                console.log("Notificacao(Pedido) adicionada com sucesso");
                res.status(201).jsonp(curso);
            }).catch((err) => {
                console.log(err);
                res.status(500).jsonp({error: err});
            })

        }
        else if (curso.visibilidade == 'publico'){
            Curso.addAluno(curso,username)
            .then((curso) => {
                res.status(201).jsonp(curso);
            }).catch((err) => {
                nxt(err);
            });
        }
    }).catch((err) => {
        nxt(err);
    });

});


//return axios.post(`${url}/cursos/${idCurso}/rate/${idFile}`, {rate: rate},{headers: { Cookie: `token=${token}` }});






module.exports = router;
