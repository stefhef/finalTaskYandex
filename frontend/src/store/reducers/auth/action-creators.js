import LoginService from "../../../services/LoginService";
import {decodeLocal} from "../../../api/Common";
import UserService from "../../../services/UserService";
import {AuthActionEnum} from "./types";

export const AuthActionCreators = {
    setIsAuth: (auth) => ({type: AuthActionEnum.SET_AUTH, payload: auth}),
    setIsLoadingAuth: (payload) => ({type: AuthActionEnum.SET_AUTH_IS_LOADING, payload}),
    setErrorAuth: (payload) => ({type: AuthActionEnum.SET_AUTH_ERROR, payload}),
    setLogin: (payload) => ({type: AuthActionEnum.SET_LOGIN, payload}),
    setUser: (payload) => ({type: AuthActionEnum.SET_AUTH_USER, payload}),
    loadUser: () => async (dispatch) => {
        UserService.getUserData().then((user) =>
            dispatch(AuthActionCreators.setUser(user)))
    },
    login: (username, password) => async (dispatch) => {
        try {   
            dispatch(AuthActionCreators.setIsLoadingAuth(true))
            const login_data = await LoginService.loginRequest(username, password)
            console.log(login_data)
            localStorage.setItem("access_token", decodeLocal(login_data.access_token))
            dispatch(AuthActionCreators.setLogin(login_data))

        } catch (e) {

            dispatch(AuthActionCreators.setIsLoadingAuth(false))
            dispatch(AuthActionCreators.setErrorAuth(`${e} - ошибка при логине`))
        }
    },
    logout: () => async (dispatch) => {
        // await LoginService.logoutRequest()
        localStorage.removeItem("access_token")
        dispatch(AuthActionCreators.setIsAuth(false))
        // return {type: AuthActionEnum.SET_AUTH, payload: false}
    }
}