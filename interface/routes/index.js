var express = require('express');
var router = express.Router();
var Dados = require('../controllers/dados');
var Auth = require('../controllers/auth');
var axios = require('axios');
var multer = require('multer');


const upload = multer({ dest: 'public/fileStore'  , 
  limits: {
    fileSize: process.env.MAX_SIZE,
  },
  fileFilter(req, file, cb) {
    if (!process.env.ALLOWED_TYPES.includes(file.mimetype)) {
      cb(new Error('File type not allowed'))
    }
    else{
      cb(null, true)
    }
  }});


/* GET home page. */

function checkLoggin(req, res, next) {
  if (req.cookies['token']) {
    console.log(req.body);
    next();
  }
  else{
    res.redirect('/no_login');
  }
}

router.get('/',checkLoggin, function(req, res, next) {
  console.log('Página Inicial');
  Dados.getAllFiles(req.cookies['token'])
    .then(dados => {
      let actions = dados.data.user.level == "professor";
      console.log("Actions",actions);
      res.render('list', { files: dados.data.lista, user: dados.data.user, actions: actions});
    })
    .catch(err => res.render('error', {error: err}));
});

router.get('/cursos',checkLoggin, function(req, res, next) {
  Dados.getAllCursos(req.cookies['token'])
    .then(dados => {
      console.log("Cursos",dados.data);
      res.redirect('/');
    })
    .catch(err => res.render('error', {error: err}));
});

router.post('/cursos',checkLoggin, function(req, res, next) {
  Dados.createCurso(req.body,req.cookies['token']).then(dados => {
    res.redirect('/cursos');}
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});



router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/no_login', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.get('/user/:id',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  axios.get('http://localhost:3001/auth/' + req.params.id + "?token=" + cookie).then(dados => {

    res.jsonp(dados.data);
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});

router.post('/login',function(req, res, next) {
  Auth.login(req.body).then(dados => {
    console.log("Cookie",dados.data.token);
    let day = 1000 * 60 * 60 * 24;
    res.cookie('token', dados.data.token, {maxAge: day});
    console.log("Cookie Saved");
    res.redirect('/');
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  }); 
});

router.get('/loggout',function(req, res, next) {
  // remove cookie
  res.clearCookie('token');
  res.redirect('/');
});


function validateFile(req, res, next) {
  if (req.file) {
    // max_size = 20MB
    if (req.file.size > process.env.MAX_SIZE) { 
      res.status(500).jsonp({error: "File too large"});
    }
    console.log(process.env);
    // type of file not in list of allowed mimetypes
    if (!process.env.ALLOWED_TYPES.includes(req.file.mimetype)) {
      res.status(500).jsonp({error: "File type not allowed"});
    }
    next();
  }
  else{
    res.status(500).jsonp({error: "No file"});
  }
}

    


router.post('/files',checkLoggin,upload.single("file"), function(req, res, next) {
  console.log("Upload File");
  Dados.insert(req.file,req.body,req.cookies['token']).then(dados => {
    res.redirect('/');
  }
  ).catch(err => {
    res.render('error', {error: err});
    // res.status(500).jsonp({error: err});
  });
});

router.get('/files/upload',checkLoggin, function(req, res, next) {
  console.log("FileForm");
  res.render('fileForm');
});


/*
router.get('/files/:id',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  Dados.getOne(req.params.id,cookie).then(dados => {
    
    //save file
    res.send(dados.data);
    
    //res.render('file', { file: dados.data });
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});
*/


router.post('/register',function(req, res, next) {
  Auth.register(req.body).then(dados => {
    res.redirect('/');
  }
  ).catch(err => {
    res.render('error', {error: err});
  });
});
module.exports = router;
