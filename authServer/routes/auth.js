var express = require('express');
var router = express.Router();
var User = require('../controller/user');
var UserModel = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');


function verificaAcesso(req, res, next) {
  console.log("COOKIES: ",req.cookies)
  var myToken = req.cookies.token;
  console.log("TOK: ",myToken)
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


/* GET users listing. */
router.get('/', verificaAcesso,function(req, res, next) {
  User.list()
    .then(data => res.jsonp(data))
    .catch(err => res.jsonp({error: err}));
});

router.get('/getNames', verificaAcesso,function(req, res, next) {
  console.log("OLA")
  console.log(req.query)
  console.log(req.query.username_array)

  let promises = [];
  let array = req.query.username_array;
  for (let i = 0; i<array.length; i++) {
      promises.push(User.getUser(array[i]));
  }

  Promise.all(promises)
  .then(users => {
      let names = users.map((user, index) => {
          return {
              username: array[index],
              name: user.name,
              id: user._id
          };
      });
      console.log(names)
      res.jsonp(names);
  })
  .catch(err => {
      res.jsonp({error: err});
  });
});  

router.get('/:id', verificaAcesso ,function(req, res, next) {
  console.log(req.params.id)
  User.getUserId(req.params.id)
    .then(data => {
      console.log(data)
      res.jsonp(data)
      
    })
    .catch(err => res.jsonp({error: err}));
});


router.post('/register', function(req, res, next) {
  console.log("Register",req.body);
  var affiliation = null;
  if (req.body.afiliacao == "true") {
    affiliation = {
      university: req.body.universidade,
      department: req.body.departamento,
    }
  }
  
  UserModel.register(new UserModel({
    username: req.body.email,
    level : req.body.level,
    affiliation: affiliation,
    active : true,
    name: req.body.name,
    registerDate : new Date().toISOString().substring(0,16)
  }), 
  req.body.password, 
  function(err, user) {
    if (err) {
      console.log('Erro no registo: ' + err);
      return res.status(520).jsonp({error: err});
    }
    else{
      res.status(201).jsonp('OK');
    }
  });
});



router.post('/login', passport.authenticate('local'), function(req, res){
  User.getUser(req.user.username).then(user => {
    console.log("USER: ",user)
    jwt.sign({ 
      username: req.user.username,
      level: req.user.level,
      name: req.user.name,
      affiliation: user.affiliation,
      registerDate: req.user.registerDate.toISOString().substring(0,16),
      sub: 'RPCW2023'}, 
      process.env.JWT_KEY,
      {expiresIn: '23h'},
      function(e, token) {
        if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
        else res.status(201).jsonp({token: token})
      });
    }).catch(err => {
      console.log(err)
      res.jsonp({error: err})
    })
})


// update info user
router.post('/update',verificaAcesso,function(req, res, next) {
    console.log("USER: ",req.user)
    console.log("INFO: ",req.body)
    var user = req.user
    var user_fields = req.body.user_fields
    for (const [key, value] of Object.entries(user_fields)) {
        if (key in user_fields){
            user[key] = value
        }
    }

    console.log("USER2: ", user)
    User.updateUser(req.user.username, user)
      .then(data => {
        jwt.sign({ 
          username: req.user.username,
          level: req.user.level,
          name: req.user.name,
          affiliation: req.user.affiliation,
          registerDate: req.user.registerDate,
          sub: 'RPCW2023'}, 
          process.env.JWT_KEY,
          {expiresIn: '23h'},
          function(e, token) {
            if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
            else res.status(201).jsonp({token: token, info: data})
        });
      })
      .catch(err => {
        console.log(err)
        res.jsonp({error: err})
      })

});

// delete user
router.delete('/delete', verificaAcesso ,function(req, res, next) {
  User.deleteUser(req.user.id)
    .then(data => res.jsonp(data))
    .catch(err => res.jsonp({error: err}));
});

/*
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
*/


module.exports = router;
