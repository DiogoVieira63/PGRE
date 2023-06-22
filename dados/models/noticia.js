
const mongoose = require('mongoose')



const notificationSchema = new mongoose.Schema({
    "descricao": String,
    "lida": Boolean,
    "link": String,
})


const pedidoSchema = new mongoose.Schema({
    "tipo": String,
    "feitoPor": String,
    "info": String,
})


const noticiasSchema = new mongoose.Schema({
    "username" : String,
    "notificacao": [notificationSchema],
    "pedido": [pedidoSchema]
})

/*
### Professor
- Acesso Curso (Aluno)

### Admin
- Adicionar Tipo
- Criar Curso
- Remover Curso
"""
*/

module.exports = mongoose.model('noticia', noticiasSchema);