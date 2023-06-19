var express = require("express");
var router = express.Router();
var fs = require("fs");

const Meta = require("../controllers/meta");
const Curso = require("../controllers/curso");

const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyCourse = Permission.course;



// upload file meta
router.post("/",verifyJWT,function (req, res, nxt){
  var file = req.body.file;
  console.log(file);
  var body = req.body.body;
  console.log(body);
  var meta = {
    id: file.filename,
    name: file.originalname,
    title: body.title,
    subtitle: body.subtitle,
    description: body.description,
    creationDate: new Date(body.creationDate).toISOString().substring(0, 19),
    registationDate: new Date().toISOString().substring(0, 19),
    tags: body.tags,
    theme: body.theme,
    ratings: [],
    author: body.author,
    uploadBy: req.user.username,
    course: body.course,
    mimetype: file.mimetype,
    size: file.size,
  }
  Meta.insert(meta)
    .then((meta) => {
      if (body.post == "true") {
        var post = {
          "title": body.post_titulo,
          "description": body.post_descricao,
          "comments": [],
          "publishedBy": req.user.username,
          "id_meta": meta._id,
        }
        Curso.addPost(meta.course, post).then((curso) => {
          res.status(201).send();
        }).catch((err) => { 
          res.status(500).jsonp({error: err});
        });
      }
      else {
        res.status(201).send();
      }
    })
    .catch((err) => {
      res.status(500).jsonp({error: err});
    });
});


// edit file meta
router.put("/:id",verifyJWT,verifyProfessor, function (req, res, nxt){
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
  }
  Meta.update(id,meta)
    .then((meta) => {

      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

// delete file meta
router.delete("/:id",verifyJWT,verifyProfessor, function (req, res, nxt){
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
router.get("/course/:course",verifyJWT,verifyCourse,function (req, res) {
  var d = new Date().toISOString().substring(0, 19);
  console.log("User",req.user);
  var course = req.params.course;
  Meta.getAllByCourse(course).then((data) => {
    res.jsonp({data});
  }).catch((err) => {
    console.log(err);
    res.status(500).jsonp({error: err});
  });
});


// get all files
router.get("/",verifyJWT, function (req, res) {
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

// get one file
router.get("/:id", function(req, res, nxt){
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

// add rating
router.post(".:id/rating",verifyJWT, verifyCourse, function (req, res, nxt){
  var id = req.params.id;
  var rating = req.body.rating;
  var user = req.user.id;
  Meta.addRating(id, user, rating)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

// delete rating
router.delete("/:id/rating",verifyJWT, verifyCourse, function (req, res, nxt){
  var id = req.params.id;
  var user = req.user.id;
  Meta.deleteRating(id, user)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});

// edit rating
router.put("/:id/rating",verifyJWT, verifyCourse, function (req, res, nxt){
  var id = req.params.id;
  var rating = req.body.rating;
  var user = req.user.id;
  Meta.editRating(id, user, rating)
    .then((meta) => {
      res.status(201).send();
    })
    .catch((err) => {
      nxt(err);
    });
});



module.exports = router;
