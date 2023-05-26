var jwt = require("jsonwebtoken");

function token(req, res, next) {
  var token = req.cookies.token;
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
  var course = req.params.course;
  var id = req.user.id;
  Curso.hasPermission(id, course)
    .then((hasPermission) => {
      if (hasPermission) {
        next();
      } else {
        res.status(403).send();
      }
    })
    .catch((err) => {
      res.status(500).send();
    });
}

function professor(req, res, next) {
  var course = req.params.course;
  var id = req.user.id;
  course
    .isProfessor(id, course)
    .then((isProfessor) => {
      if (isProfessor) {
        next();
      } else {
        res.status(403).send();
      }
    })
    .catch((err) => {
      res.status(500).send();
    });
}

function admin(req, res, next) {
  var id = req.user.id;
  Curso.isAdmin(id)
    .then((isAdmin) => {
      if (isAdmin) {
        next();
      } else {
        res.status(403).send();
      }
    })
    .catch((err) => {
      res.status(500).send();
    });
}

module.exports = {
    token,
    course,
    professor,
    admin
}
