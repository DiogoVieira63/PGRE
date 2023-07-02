var axios = require('axios');



module.exports.getAllFiles = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;  
    return axios.get(`${url}/meta/files`,{headers: { Cookie: `token=${token}` }});
}


module.exports.getOne = (id, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/${id}`,{headers: { Cookie: `token=${token}` }});
}
module.exports.getOneDownload = (id, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/download/${id}`,{headers: { Cookie: `token=${token}` }});
}


module.exports.getAllByCourse = (id,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;  
    return axios.get(`${url}/meta/files/course/${id}`,{headers: { Cookie: `token=${token}` }});
}


module.exports.insert= (file,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/meta/files`, {file: file, body: body},{headers: { Cookie: `token=${token}` }});

}

module.exports.getFile = (id, token) => { 
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/${id}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getAllCursos = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getAllCursosByUser = (username, token) => {
    console.log("username: ", username)
    console.log("token: ", token)
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/user`,{params:{username},headers: { Cookie: `token=${token}` }});
}

module.exports.getOneCurso = (id,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${id}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getMyCursos = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/meuscursos`,{headers: { Cookie: `token=${token}` }});
}

module.exports.createCurso = (curso,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/create`, {curso: curso},{headers: { Cookie: `token=${token}` }});
}

module.exports.editarCurso = (curso,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/edit/${curso}`,body,{headers: { Cookie: `token=${token}` }});
}

module.exports.getProfile = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/profile`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getOnePost = (id,idpost,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${id}/posts/${idpost}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.entrarCurso = (idCurso,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${idCurso}/entrar`,{headers: { Cookie: `token=${token}` }});
}

module.exports.confirmarEntradaCurso = (idCurso,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/${idCurso}/entrar/confirmar`,body,{headers: { Cookie: `token=${token}` }});
}

module.exports.cancelarEntradaCurso = (idCurso,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/${idCurso}/entrar/cancelar`,body,{headers: { Cookie: `token=${token}` }});
}


module.exports.getTypesActives = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/types/active`,{headers: { Cookie: `token=${token}` }});
}

module.exports.rateFile = (idFile,rate,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/meta/files/${idFile}/rating`, {rate: rate},{headers: { Cookie: `token=${token}` }});
}

module.exports.rateFileEdit = (idFile,rate,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.put(`${url}/meta/files/${idFile}/rating`, {rate: rate},{headers: { Cookie: `token=${token}` }});
}

module.exports.rateFileDelete = (idFile,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.delete(`${url}/meta/files/${idFile}/rating`,{headers: { Cookie: `token=${token}` }});
}

module.exports.register = (user) => {
    console.log("user",user);
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/noticias`, {username: user});
}

module.exports.addPost= (body,username,token) => {
    console.log(body)
    let course = body.course 
    var post = {
        "title": body.title,
        "description": body.description,
        "comments": [],
       "publishedBy": username,
        "id_meta": "",
    }
    console.log("POST: ",post)
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/${course}/addpost`, post,{headers: { Cookie: `token=${token}` }});

}

module.exports.comment = (comment,token,idCurso,idPost) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/${idCurso}/${idPost}/addcomment`, comment,{headers: { Cookie: `token=${token}` }});
}

module.exports.removeComment = (token,idCurso,idPost,idComment) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.delete(`${url}/cursos/${idCurso}/${idPost}/${idComment}/removecomment`,{headers: { Cookie: `token=${token}` }});
}

module.exports.editComment = (token,idCurso,idPost,idComment,comment) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/${idCurso}/${idPost}/${idComment}/editcomment`,comment,{headers: { Cookie: `token=${token}` }});
}

module.exports.removeAluno = (token,idCurso,aluno) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.delete(`${url}/cursos/${idCurso}/removealuno`,{params:{aluno},headers: { Cookie: `token=${token}` }});
}

module.exports.getCertainPedido = (curso, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/noticias/getpedido`,{params:{curso},headers: { Cookie: `token=${token}` }});
}

module.exports.getPedidos = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/noticias/pedidos`,{headers: { Cookie: `token=${token}` }});
}

module.exports.respostaPedido = (pedido,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/noticias/pedidos/${pedido}/resposta`,body,{headers: { Cookie: `token=${token}` }});
}

module.exports.addNotificacao = (body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/noticias/notificacoes`,body,{headers: { Cookie: `token=${token}` }});
}

module.exports.getUniversidades = () => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/universidades`);
}


