// 两个参数
import { combineReducers } from 'redux'
import { USER_NAME, PASS_WORD } from './actions'

const initialState = {
    userName:'zs',
    password:123
}
const getUserName = (state = initialState.userName, action) => {
    switch (action.type) {
        case USER_NAME:
            return action.userName;
        break;
        default:
        return state;
    }
}
const getPassword = (state = initialState.password, action) => {
    switch (action.type) {
        case PASS_WORD:
            return action.password;
        break;
        default:
        return state;
    }
}

export default combineReducers({
    myUserName: getUserName,
    myPassword:getPassword
})