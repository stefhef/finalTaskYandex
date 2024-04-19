import {AuthActionEnum} from "./types";

const initialState = {
    isAuth: false,
    isLoading: false,
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AuthActionEnum.SET_AUTH:
            return {...state, isAuth: action.payload, isLoading: false}
        case AuthActionEnum.SET_AUTH_ERROR:
            return {...state, error: action.payload, isLoading: false}
        case AuthActionEnum.SET_AUTH_IS_LOADING:
            return {...state, isLoading: action.payload}
        case AuthActionEnum.SET_LOGIN:
            return {...state, ...action.payload, isLoading: false, isAuth: true, error: undefined}
        case AuthActionEnum.SET_AUTH_USER:
            return {...state, user: action.payload, isLoading: false, error: undefined, isAuth: true}
        default:
            return state;
    }
}   