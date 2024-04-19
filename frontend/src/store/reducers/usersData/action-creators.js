
import {
    UsersDataActionEnum
} from "./types";
import UserService from "../../../services/UserService";

export const UsersDataActionCreators = {
    clearUsersData: () => ({type: UsersDataActionEnum.CLEAR_USERS_DATA}),
    setUsersData: (payload) => ({type: UsersDataActionEnum.SET_USERS_DATA, payload}),
    setIsLoadingUsersData: (payload) => ({type: UsersDataActionEnum.SET_USERS_DATA_IS_LOADING, payload}),
    setErrorUsersData: (payload) => ({type: UsersDataActionEnum.SET_ERROR_USERS_DATA, payload}),
    addUserData: (payload) => ({type: UsersDataActionEnum.ADD_USER_DATA, payload}),
    fetchUserData: (user_id) => async (dispatch) => {
        dispatch(UsersDataActionCreators.setIsLoadingUsersData(true))
        const response = await UserService.getUserById(user_id)
        if (response) {
            dispatch(UsersDataActionCreators.addUserData(response))
        }
        dispatch(UsersDataActionCreators.setIsLoadingUsersData(false))
    }
}