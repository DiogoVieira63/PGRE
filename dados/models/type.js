
const mongoose = require('mongoose')


const typeSchema = new mongoose.Schema({
    "id": String,
    "state": String // ('active', 'inactive','pending')
})



module.exports = mongoose.model('type', typeSchema);