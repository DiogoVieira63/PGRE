const mongoose = require('mongoose')

var Universidade = require('../models/universidade');


    
// create a new curso
module.exports.getAll = () => {
    return Universidade.find().then(uni => {
        return uni;
    }).catch(err => {
        return err;
    });
}


module.exports.insert = (body) => {
    return Universidade.create(body).then(uni => {
        return uni;
    }).catch(err => {
        return err;
    });
}

module.exports.insertDepartamento = (body) => {
    return Universidade.findOneAndUpdate(
        { _id: body.universidade },
        { $push: { departamentos: body.departamento } },
    ).then(uni => {
        return uni;
    }).catch(err => {
        return err;
    })
}



