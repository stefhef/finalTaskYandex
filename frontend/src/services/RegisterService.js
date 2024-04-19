import {request} from "../api/api";


export default class RegisterService {
    static async registerRequest(name, surname,
                              username, email,
                              password, about) {
        const requestConfig = {
            method: "get",
            url: "http://127.0.0.1:8000/auth/register",
            params: {name: name, surname: surname,
                username: username, email: email,
                password: password, about: about},
            auth: false,
            withCredentials: true
        }
        return request(requestConfig)
    }
}