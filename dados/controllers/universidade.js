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

