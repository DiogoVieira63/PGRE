var axios = require('axios');




module.exports.login = (user) => {
    let url = `http://localhost:${process.env.AUTH_PORT}`;
    return axios.post(`${url}/login`, user);
}

module.exports.register = (user) => {
    let url = `http://localhost:${process.env.AUTH_PORT}`;
    return axios.post(`${url}/register`, user);
}

module.exports.update = (user_fields,token) => {
    let url = `http://localhost:${process.env.AUTH_PORT}`;
    return axios.post(`${url}/update`, {user_fields}, {headers: {Cookie: `token=${token}`}});
}

module.exports.getNames = (username_array, token) => {
    console.log(token)
    console.log(username_array)
    let url = `http://localhost:${process.env.AUTH_PORT}`;
    return axios.get(`${url}/getNames`, {params:{username_array}, headers: {Cookie: `token=${token}`}});
}