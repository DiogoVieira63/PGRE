
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

module.exports.getAll = (level) => {
    return Meta.find()
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
        console.log(meta);
        return meta;
    })
    .catch(err => {
        return err;
    })
}

module.exports.getOneId = (id) => {
    return Meta.findOne({ id: id })
    .then(meta => {
        console.log(meta);
        return meta;
    })
    .catch(err => {
        console.log(err);
        return err;
    })
}




module.exports.getAllByCourse = (course) => {
    return Meta.find({ course: course })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}

module.exports.update = (id, meta) => {
    return Meta.updateOne({ _id: id }, meta).then(meta => {
        return meta;
    }).catch(err => {
        return err;
    })
}

module.exports.delete = (id) => {
    return Meta.deleteOne({ _id: id })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}

module.exports.addRating = (id, rating) => {
    return Meta.updateOne({ _id: id }, { $push: { ratings: rating } })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}

module.exports.deleteRating = (id, user) => {
    return Meta.updateOne({ _id: id }, { $pull: { ratings: { id: user } } })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}


module.exports.editRating = (id, rating) => {
    return Meta.updateOne({ _id: id, "ratings.id": rating.id }, { $set: { "ratings.$.value": rating.value } })
    .then(meta => {
        return meta;
    })
    .catch(err => {
        return err;
    })
}

