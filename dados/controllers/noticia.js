
var Noticia = require("../models/noticia");

module.exports.insert = noticia => {
    return Noticia.create(noticia)
        .then(noticia => {  
            console.log(noticia);
            return noticia;
        }).catch(err => {
            console.log(err);
            return err;
    });
}


module.exports.get = (id) => {
    return Noticia.findOne({ username: id })
        .then(noticia => {
            return noticia;
        })
        .catch(err => {
            return err;
        })
}


module.exports.insertNotificacao = (id, notificacao) => {
    return Noticia.findOneAndUpdate({ username: id }, { $push: { notificacao: notificacao } })
        .then(noticia => {
            return noticia;
        })
        .catch(err => {
            return err;
        })
}

module.exports.lida = (id, notificacao) => {
    return Noticia.findOneAndUpdate({ username: id, "notificacao._id": notificacao }, { $set: { "notificacao.$.lida": true } })
        .then(noticia => {
            return noticia;
        }).catch(err => {
            return err;
        });
}


