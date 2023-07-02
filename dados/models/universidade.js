
const mongoose = require('mongoose')



const uniSchema = new mongoose.Schema({
    "nome": String,
    "departamentos": [String],
})


module.exports = mongoose.model('universidade', uniSchema);