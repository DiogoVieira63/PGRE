var express = require('express');
var router = express.Router();
var User = require('../controller/user');
var UserModel = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');


/* GET users listing. */
router.get('/', verificaAcesso,function(req, res, next) {
  User.list()
    .then(data => res.jsonp(data))
    .catch(err => res.jsonp({error: err}));
});


router.get('/:id', verificaAcesso ,function(req, res, next) {
  User.getUser(req.params.id)
    .then(data => res.jsonp(data))
    .catch(err => res.jsonp({error: err}));
});


router.post('/register', function(req, res, next) {
  console.log("Register",req.body);
  UserModel.register(new UserModel({
    username: req.body.username,
    level : req.body.level,
    active : true,
    dateCreated : new Date().toISOString().substring(0,16)
  }), 
  req.body.password, 
  function(err, user) {
    if (err) {
      return res.status(520).jsonp({error: err});
    }
    else{
      res.status(201).jsonp('OK');
    }
  });
});


function verificaAcesso(req, res, next) {
  var myToken = req.query.token || req.body.token;
  console.log("token",myToken);
  if (myToken) {
    jwt.verify(myToken, process.env.JWT_KEY, function(err, decoded) {
      if (err) {
        console.log('Token inválido.');
        return res.status(403).jsonp({success: false, status: 'Token Inválido.'});
      }
      else {
        req.user = decoded;
        console.log('Token válido do user.', req.user);
        next();
      }
    })
  }else{
    res.status(403).jsonp({success: false, status: 'Não foi fornecido um token.'});
  }
}

router.post('/login', passport.authenticate('local'), function(req, res){
  jwt.sign({ 
    username: req.user.username,
    level: req.user.level,
    sub: 'RPCW2023'}, 
    process.env.JWT_KEY,
    {expiresIn: '23h'},
    function(e, token) {
      if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
    });
})


router.put('/:id', verificaAcesso ,function(req, res, next) {
  User.updateUser(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(err => res.jsonp({error: err}));
});

router.delete('/:id', verificaAcesso ,function(req, res, next) {
  User.updateUser(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(err => res.jsonp({error: err}));
});

module.exports = router;
