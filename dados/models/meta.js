
const mongoose = require('mongoose')


const ratingSchema = new mongoose.Schema({
    "id": String,
    "value": Number
})


const metaSchema = new mongoose.Schema({
    "id":String,
    "name": String,
    "type": String,
    "title": String,
    "subtitle": String,
    "description": String,
    "creationDate": Date,
    "registationDate": Date,
    "tags": [String],
    "theme": String,
    "ratings": [ratingSchema],
    "author": String,
    "uploadBy": String,
    "course": String,
    "mimetype": String,
    "size": Number,
})


module.exports = mongoose.model('meta', metaSchema);