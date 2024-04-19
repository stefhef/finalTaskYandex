import {request} from "../api/api";


export default class LoginService {
    static async loginRequest(username, password) {
        const requestConfig = {
            method: "get",
            url: "/auth/login",
            params: {username: username,
            password: password},
            auth: false,
            withCredentials: true
        }
        return request(requestConfig)
    }
    static async logoutRequest() {
        const requestConfig = {
            method: "get",
            url: "/auth/logout",
            auth: false,
            withCredentials: true
        }
        return request(requestConfig);
    }
}