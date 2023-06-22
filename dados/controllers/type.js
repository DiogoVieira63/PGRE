
var Type = require("../models/type");

module.exports.insert = type => {
    return Type.create(type)
        .then(type => {
        return type;
    }).catch(err => {
        return err;
    });
}

module.exports.update = (id, type) => {
    return Type.updateOne({ _id: id }, type).then(type => {
        return type;
    }).catch(err => {
        return err;
    })
}

module.exports.delete = (id) => {
    return Type.deleteOne({ _id: id })
        .then(type => {
        return type;
    }).catch(err => {
        return err;
    })
}

module.exports.getAll = () => {
    return Type.find().then(type => {
        return type;
    }).catch(err => {
        return err;
    })
 }


module.exports.getActives = () => {
    return Type.find({state: "active"}).sort({id: 1}).then(type => {
        console.log("Types",type);
        return type;
    }).catch(err => {
        return err;
    })
}


module.exports.getPendings = () => {
    return Type.find({state: "pending"}).then(type => {
        return type;
    }).catch(err => {
        return err;
    })
}