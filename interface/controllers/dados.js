var axios = require('axios');



module.exports.getAllFiles = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;  
    return axios.get(`${url}/meta/files`,{headers: { Cookie: `token=${token}` }});
}


module.exports.getOne = (id, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/files/${id}`,{headers: { Cookie: `token=${token}` }});
}


module.exports.insert= (file,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/files`, {file: file, body: body},{headers: { Cookie: `token=${token}` }});

}

module.exports.getFile = (id, token) => { 
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/files/${id}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getAllCursos = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos`),{headers: { Cookie: `token=${token}` }};
}

module.exports.createCurso = (curso,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/create`, {curso: curso},{headers: { Cookie: `token=${token}` }});
}
