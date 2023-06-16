
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    "comment": String,
    "idUser": String
})

const postSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "comments": [commentSchema],
    "publishedBy": String,
    "id_meta": String,
})


const cursoSchema = new mongoose.Schema({
    "nome": String,
    "descricao": String,
    "professores": Array,
    "alunos": Array,
    "posts": [postSchema],
    "type": String
})


module.exports = mongoose.model('curso', cursoSchema);