var User = require('../models/user');

module.exports.list = () => {
    return User
        .find()
        .then(users => {
            return users;
        })
        .catch(err => {
        return err;
    })
}

module.exports.getUser= id => {
    return User.findOne({username: id})
    .then(user => {
        return user;
    })
    .catch(err => {
        return err;
    })
}

module.exports.updateUser = (id, user) => {
    return User.updateOne({_id: id}, user)
    .then(user => {
        return user;
    })
    .catch(err => {
        return err;
    })
}