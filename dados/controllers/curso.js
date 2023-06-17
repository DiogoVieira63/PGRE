const mongoose = require('mongoose')

var Curso = require('../models/curso');


    
// create a new curso
module.exports.insert = (curso,username) => {
    curso["professores"] = [username];
    return Curso.create(curso).then(curso => {
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

module.exports.removeCurso = (id) => {
    return Curso.deleteOne({_id:id}).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

module.exports.removeAluno = (idcurso, alunoId) => {
    return Curso.updateOne(
        {_id: idcurso}, 
        {$pull: {alunos: alunoId}}
    ).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

module.exports.removeProfessor = (idcurso, profId) => {
    return Curso.updateOne(
        {_id: idcurso}, 
        {$pull: {professores: profId}}
    ).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

module.exports.addPost = (idcurso, post) => {
    return Curso.updateOne(
        {_id: idcurso}, 
        {$push: {posts: post}}
    ).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

module.exports.addCommentPost = (idcurso, idpost, comment) => {

    let commentSchema = {
        _id: new mongoose.Types.ObjectId(),
        comment: comment,
    };

    return Curso.updateOne(
        {_id: idcurso, 'posts._id': idpost}, 
        {$push: {'posts.$.comments': commentSchema}}
    ).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}


module.exports.editCommentPost = (idcurso, idpost, idcomment, comment) => {
    return Curso.updateOne(
        {_id: idcurso, 'posts._id': idpost, 'posts.comments._id': idcomment}, 
        {"$set": {"posts.$.comments.$[elem].comment": comment}},
        {arrayFilters: [{"elem._id": idcomment}]}
    ).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}

module.exports.removeCommentPost = (idcurso, idpost, idcomment) => {
    return Curso.updateOne(
        {_id: idcurso, 'posts._id': idpost},
        {$pull: {'posts.$.comments': { _id: idcomment}}}
    ).then(curso => {
        return curso;
    }).catch(err => {
        return err;
    });
}


module.exports.isProfessor = (idCurso, idProfessor) =>{
    return Curso.findOne( {_id : idCurso, professores: idProfessor}).then(
        _ => {
        return true;
    }).catch(err => {
        return err;
    });
}

module.exports.hasPermissionCurso = (idCurso, id,level) =>{
    if(level == "professor"){
        return Curso.findOne( {_id : idCurso, professores: id}).then(
        _ => {
        return true;
        }).catch(err => {
            return err;
        });}
    else if(level == "aluno"){
        return Curso.findOne( {_id : idCurso, alunos: id}).then(
            _ => {
            return true;
        }).catch(err => {
            return err;
        });
    }
    else return true;
}

module.exports.editPost = (idcurso, idpost, post) => {

    return Curso.findOne({_id: idcurso, 'posts._id': idpost}).then(to_replace_post => {
        to_replace_post = to_replace_post["posts"]
        for (let i = 0; i<to_replace_post.length; i++){
            if (to_replace_post[i]["_id"] == idpost){
                to_replace_post = to_replace_post[i]
                break
            }
        }
        console.log(to_replace_post)
        console.log(typeof to_replace_post)
        for (let key in post){
            if (key != "_id"){
                console.log(key)
                console.log(post[key])
                console.log(to_replace_post[key])
                to_replace_post[key] = post[key]
            }
        }
        console.log("AFTER: " + to_replace_post)
        return Curso.updateOne(
            {_id: idcurso, 'posts._id': idpost}, 
            {$set: {'posts.$': to_replace_post}}
        ).then(curso => {
            console.log(curso);
            return curso;
        }).catch(err => {
            return err;
        });
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

*/


