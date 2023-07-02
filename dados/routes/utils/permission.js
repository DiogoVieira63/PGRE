var jwt = require("jsonwebtoken");
const Curso = require("../../controllers/curso");


function token(req, res, next) {
  var token = req.cookies.token;
  console.log("token -> "+token)
  jwt.verify(
    token,
    process.env.JWT_KEY,
    {
      expiresIn: "1d",
    },
    function (err, decoded) {
      if (err) {
        console.log("Failed", err);
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      // pass decoded to next middleware
      req.user = decoded;
      next(); 
    }
  );
}

function course(req, res, next) {
  var curso = req.params.curso;
  var id = req.user.username;
  var level = req.user.level;
  console.log("User",req.user,req.params)
  Curso.hasPermissionCurso(id, curso, level)
    .then((hasPermission) => {
      console.log("hasPermission",hasPermission)
      req.permission = hasPermission;
      next();
    })
    .catch((err) => {
      console.log("ERRO PERMISSAO: "+err)
      res.status(500).send();
    });
}

function professor(req, res, next) { 
  if( req.user.level == "professor"){
      var course = req.params.course;
      if (course){
        var id = req.user.username;
        Curso
          .isProfessor(id, course)
          .then((isProfessor) => {
            if (isProfessor) {
              next();
            } else {
              res.status(403).send();
            }
          })
          .catch((err) => {
            console.log("ERRO PERMISSAO: "+err)
            res.status(500).send();
          });
      }else{
        next();
      }
  }
  else{
    res.status(403).send();
  }
}

function admin(req, res, next) {
  var level = req.user.level;
  if (level == "admin"){
    next();
  }
  else{
    res.status(403).send();
  }
}

module.exports = {
    token,
    course,
    professor,
    admin
}
