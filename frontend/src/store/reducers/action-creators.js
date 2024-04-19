import {AuthActionCreators} from "./auth/action-creators";
import {UsersDataActionCreators} from "./usersData/action-creators";

export const allActionCreators = {
    ...AuthActionCreators,
    ...UsersDataActionCreators
}