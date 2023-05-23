var axios = require('axios');




module.exports.login = (user) => {
    let url = `http://localhost:${process.env.AUTH_PORT}`;
    return axios.post(`${url}/login`, user);
}



module.exports.register = (user) => {
    let url = `http://localhost:${process.env.AUTH_PORT}`;
    return axios.post(`${url}/register`, user);
}

    