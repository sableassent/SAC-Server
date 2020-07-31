import axios from 'axios';
import AuthService from './services/AuthService';

export const request = async (obj) => {
    let headers = {};
    let authorization = AuthService.getAuthorizationHeader();
    if (authorization) headers['Authorization'] = authorization;
    try {
        if (obj.params) {
            for (let param in obj.params) {
                if (typeof obj.params[param] === 'undefined' || obj.params[param] === null) {
                    delete obj.params[param];
                }
            }
        }
        const response = await axios.create({
            baseURL:  process.env.REACT_APP_BASE_URL ?
                process.env.REACT_APP_BASE_URL :
                "http://localhost:3000/",
            headers: headers
        })(obj);
        return response.data;
    } catch (error) {
        if (error.response) {

            console.log(error.response);
            if (error.response.data) {
                throw Error(error.response.data);
            }
        } else {
            throw Error('Server error.');
        }
        throw Error('Internet error.');
    }
}