
var Curso = require('../models/curso');


    
// create a new curso
module.exports.insert = (id,username) => { 
    return Curso.create({
        nome : id,
        professores : [username],
        alunos : []
    }).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

// add aluno to curso
module.exports.addAluno = (id,username) => {
    return Curso.findOneAndUpdate({nome : id},{$push : {alunos : username}}).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

// add professor to curso
module.exports.addProfessor = (id,username) => {
    return Curso.findOneAndUpdate({nome : id},{$push : {professores : username}}).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

// find all alunos's cursos
module.exports.findByAluno = (username) => {
    return Curso.find({alunos : username}).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

// find all professor's cursos
module.exports.findByProfessor = (username) => {
    return Curso.find({professores : username}).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

// find all cursos
module.exports.getAll = () => {
    return Curso.find().then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}



/*
module.exports.getOne = (id) => {
    return Meta.findOne({ _id: id })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}

module.exports.getAll = (level) => {
    return Meta.find({level : level})
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}
*/


