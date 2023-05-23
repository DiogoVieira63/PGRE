
const mongoose = require('mongoose')


const cursoSchema = new mongoose.Schema({
    "nome": String,
    "professores": Array,
    "alunos": Array,
})


module.exports = mongoose.model('curso', cursoSchema);