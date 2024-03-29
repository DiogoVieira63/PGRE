
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

module.exports.resposta = (id, notificacao, resposta) => {
    return Noticia.findOneAndUpdate({ username: id, "pedido._id": notificacao}, { $set: { "pedido.$.respondido": true , "pedido.$.aceite": resposta } })
        .then(noticia => {
            return noticia;
        }).catch(err => {
            return err;
        });
}

module.exports.insertPedido = (id, pedido) => {
    return Noticia.findOneAndUpdate({ username: id }, { $push: { pedido: pedido } })
        .then(noticia => {
            return noticia;
        })
        .catch(err => {
            return err;
        })
}


module.exports.getCertainPedido = (username, curso) => {
    return Noticia.findOne({ 'pedido.curso': curso, 'pedido.feitoPor': username , 'pedido.respondido':false}, { 'pedido.$': 1 })
        .then(noticia => {
            return noticia;
        })
        .catch(err => {
            return err;
        })
}

module.exports.getPedidos = (username, curso) => {
    return Noticia.find({ 'pedido.curso': curso, 'pedido.feitoPor': username , 'pedido.respondido':false }).then((noticia) => {
        return noticia;
    }).catch((err) => {
        return err;
    });
}

module.exports.getOnePedido = (username,id) => {
    console.log(username,id);
    return Noticia.findOne({ username: username, 'pedido._id': id },{ 'pedido.$': 1 }).then((noticia) => {
        return noticia.pedido[0];
    }).catch((err) => {

        return err;
    });
}

module.exports.notifyAll = (notificacao) => {
    console.log(notificacao);
    return Noticia.updateMany({username: {$not: /admin@admin.pt/ }}, { $push: { notificacao: notificacao } })
        .then(noticia => {
            console.log(noticia);
            return noticia;
        })
        .catch(err => {
            console.log(err);
            return err;
        })
}
