// 用户名
export const USER_NAME = 'USER_NAME';
export const getUserName = (userName) => {
    return {
        type:USER_NAME,
        userName
    }
}
// 密码
export const PASS_WORD = 'PASS_WORD';
export const getPassword = (password) => {
    return {
        type:PASS_WORD,
        password
    }
}