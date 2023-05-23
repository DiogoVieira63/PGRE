
const mongoose = require('mongoose')


const metaSchema = new mongoose.Schema({
    "id":String,
    "date": Date,
    "name": String,
    "mimetype": String,
    "size": Number,
    "description": String,
    "level": String
})


module.exports = mongoose.model('meta', metaSchema);