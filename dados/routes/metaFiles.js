var express = require("express");
var router = express.Router();
var fs = require("fs");

const Meta = require("../controllers/meta");
const Curso = require("../controllers/curso");
const Noticia = require("../controllers/noticia");

const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require("jsonwebtoken");

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyCourse = Permission.course;



// upload file meta
router.post("/", verifyJWT, function (req, res, nxt) {
  var file = req.body.file;
  console.log(file);
  console.log("BODY CHECK: ",req.body)
  var body = req.body.body;
  var meta = {
    id: file.filename,
    name: file.originalname,
    title: body.title,
    subtitle: body.subtitle,
    description: body.description,
    creationDate: new Date(body.creationDate).toISOString().substring(0, 19),
    registationDate: new Date().toISOString().substring(0, 19),
    tags: body.tag,
    theme: body.theme,
    ratings: [],
    author: body.author,
    uploadBy: req.user.username,
    course: body.course,
    mimetype: file.mimetype,
    size: file.size,
  };

  
  Meta.insert(meta)
    .then((meta) => {
      let notificacao = {
        "descricao": "Foi adicionado um novo ficheiro",
        "lida": false,
        "link": "/files/" + meta._id,
      } 
      Curso.getOne(body.course).then((curso) => {
        console.log("Curso",curso.alunos);
        for (var i = 0; i < curso.alunos.length; i++) {
          Noticia.insertNotificacao(curso.alunos[i], notificacao).then((notificacao) => {
              console.log("Notificacao adicionada com sucesso");
          }).catch((err) => {
              console.log(err);
              res.status(500).jsonp({error: err});
          })
        }
      })



      if (body.post == "true") {
        var post = {
          title: body.post_titulo,
          description: body.post_descricao,
          comments: [],
          publishedBy: req.user.username,
          id_meta: meta._id,
        };


        Curso.addPost(meta.course, post)
          .then((curso) => {
            Curso.getOne(meta.course).then((curso) => {
              post = curso.posts[curso.posts.length-1];
              let notificacao = {
                  "descricao": `${post.title}: ${post.description}`,
                  "lida": false,
                  "link": `/cursos/${meta.course}/posts/${post._id}`,
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
            res.status(201).send();
          })
          .catch((err) => {
            res.status(500).jsonp({ error: err });
          });
      } else {
        res.status(201).send();
      }
    })
    .catch((err) => {
      res.status(500).jsonp({ error: err });
    });
});

// edit file meta
router.put("/:id", verifyJWT, verifyProfessor, function (req, res, nxt) {
  var id = req.params.id;
  var body = req.body;
  var meta = {
    name: body.name,
    title: body.title,
    subtitle: body.subtitle,
    description: body.description,
    creationDate: body.creationDate,
    visibility: body.visibility,
    tags: body.tags,
    theme: body.theme,
    author: body.author,
  };
  Meta.update(id, meta)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

// delete file meta
router.delete("/:id", verifyJWT, verifyProfessor, function (req, res, nxt) {
  var id = req.params.id;
  Meta.delete(id)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

//get all files by course
router.get("/course/:course", verifyJWT /*,verifyCourse*/, function (req, res) {
  var d = new Date().toISOString().substring(0, 19);
  console.log("User", req.user);
  var course = req.params.course;
  Meta.getAllByCourse(course)
    .then((data) => {
      console.log("DATA: " + data);
      res.jsonp({ metas: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).jsonp({ error: err });
    });
});

// get all files
router.get("/", verifyJWT, function (req, res) {
  var d = new Date().toISOString().substring(0, 19);
  console.log("User", req.user);
  var level = req.user.level;
  Meta.getAll(level)
    .then((data) => {
      res.jsonp({ lista: data, user: req.user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).jsonp({ error: err });
    });
});

// get one file
router.get("/:id", verifyJWT,function (req, res, nxt) {
  console.log("id: " + req.params.id);

  Meta.getOne(req.params.id)
    .then((meta) => {
      console.log("meta: " + meta);
      res.jsonp({ meta: meta });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).jsonp({ error: err });
      // nxt(err);
    });
});

router.get("/download/:id",verifyJWT,function (req, res, nxt) {
  Meta.getOneId(req.params.id)
    .then((meta) => {
      res.jsonp({ meta: meta });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).jsonp({ error: err });
      // nxt(err);
    });
});

// add rating
router.post("/:id/rating", verifyJWT, verifyCourse, function (req, res, nxt) {
  var id = req.params.id;
  var rating = req.body.rate;
  var user = req.user.username;
  var rate = {
    id: user,
    value: rating,
  };
  console.log("rate: " + rate);
  Meta.addRating(id, rate)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

// edit rating
router.put("/:id/rating", verifyJWT, verifyCourse, function (req, res, nxt) {
  var id = req.params.id;
  var rating = req.body.rate;
  var user = req.user.username;
  var rate = {
    id: user,
    value: rating,
  };
  Meta.editRating(id, rate)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

// delete rating
router.delete("/:id/rating", verifyJWT, verifyCourse, function (req, res, nxt) {
  var id = req.params.id;
  var user = req.user.username;
  Meta.deleteRating(id, user)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

module.exports = router;
