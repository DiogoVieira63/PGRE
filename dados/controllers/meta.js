
var Meta = require('../models/meta');


module.exports.insert = meta => { 
    return Meta.create(meta)
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}


module.exports.getOne = (id) => {
    return Meta.findOne({ _id: id })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}

module.exports.getAll = (level) => {
    return Meta.find({level : level})
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}



