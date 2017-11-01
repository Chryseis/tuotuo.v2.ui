/**
 * Created by AllenFeng on 2017/3/24.
 */
import {user as Action} from '../constants/actionType';
import cookie from 'react-cookie';
import {resCode} from '../constants/common'

const initialState = {
    isFetch: false,
    userID: null,
    access_token: cookie.load('access_token'),
    refresh_token: cookie.load('refresh_token'),
    token_type: '',
    expires_in: '',
    error_description: '',
    error: '',
    authImg: '',
    authStatus: false,
    authError: '',
    mail: '',
    authMailStatus: false,
    authMailError: '',
    registStatus: false,
    bindStatus: false,
    registError: '',
    cas_error: null,
    cas_error_des: '',
    relationAccountID: '',
    reSendMailToken: '',
    submitToken: '',
    userName: '',
    moblie: '',
    avatarTimestamp: 0,
    thirdPartyList: [],
    lang: localStorage.lang || 'zh'
}

const reducersMap = {
    [Action.GET_USER]: (state, action) => {
        return {
            mail: action.user.info.mail,
            userName: action.user.info.userName,
            mobile: action.user.info.mobile,
            userID: action.user.info.userID,
            roleList: action.user.roleList
        }
    },
    [Action.ADD_ROLE]: (state, action) => {
        let roleList = _.cloneDeep(state.roleList);
        roleList.push({roleType: action.roleType, roleCode: 'OWNER', relationID: action.relationID})
        return {roleList}
    },
    [Action.LOGIN_USER]: (state, action) => {
        action.msg.access_token && cookie.save('access_token', action.msg.access_token, {path: '/'});
        action.msg.refresh_token && cookie.save('refresh_token', action.msg.refresh_token, {path: '/'});
        return {...action.msg, isFetch: false}
    },
    [Action.ISFETCH]: (state, action) => ({isFetch: true}),
    [Action.LOAD_AUTH_IMG]: (state, action) => ({authImg: action.authImg}),
    [Action.SEND_MAIL]: (state, action) => {
        if (action.authCode == resCode.OK) {
            return {
                authStatus: true,
                authMailError: '',
                mail: action.mail,
                reSendMailToken: action.reSendMailToken,
                isFetch: false
            }
        } else {
            if (state.reSendMailToken == '') {
                return {
                    authStatus: false,
                    authError: '验证码错误',
                    isFetch: false
                }
            }
        }
    },
    [Action.RESET_AUTH_STATUS]: (state, action) => {
        return {
            authStatus: false,
            authError: '',
            authMailStatus: false,
            authMailError: ''
        }
    },
    [Action.VERIFY_MAIL_CODE]: (state, action) => {
        return action.mailAuthCode == resCode.OK ? {
            authMailStatus: true,
            authMailError: '',
            submitToken: action.submitToken
        } : {
            authMailStatus: false,
            authMailError: '验证码错误',
            isFetch: false
        }
    },
    [Action.REGIST_USER]: (state, action) => {
        action.msg.access_token && cookie.save('access_token', action.msg.access_token, {path: '/'});
        action.msg.refresh_token && cookie.save('refresh_token', action.msg.refresh_token, {path: '/'});
        return action.msg.code ? {registStatus: false, registError: '账号已存在'} : {
            ...action.msg,
            registStatus: true
        }
    },
    [Action.EDIT_PASSWORD]: (state, action) => {
        return action.msg.code == resCode.InternalServerError ? {
            registStatus: false, registError: '密码更新失败'
        } : {
            registStatus: true
        }
    },
    [Action.THIRD_LOGIN]: (state, action) => {
        action.msg.access_token && cookie.save('access_token', action.msg.access_token, {path: '/'});
        action.msg.refresh_token && cookie.save('refresh_token', action.msg.refresh_token, {path: '/'})
        return {
            cas_error: action.msg.error,
            cas_error_des: action.msg.error_description,
            relationAccountID: action.msg.relationAccountID,
            access_token: action.msg.access_token,
            refresh_token: action.msg.refresh_token
        }
    },
    [Action.THIRD_BIND_INNER]: (state, action) => {
        let thirdPartyList = _.cloneDeep(state.thirdPartyList);
        thirdPartyList.push(action.msg);
        return {
            thirdPartyList
        }
    },
    [Action.BIND_USER]: (state, action) => {
        action.msg.access_token && cookie.save('access_token', action.msg.access_token, {path: '/'});
        action.msg.refresh_token && cookie.save('refresh_token', action.msg.refresh_token, {path: '/'});
        return action.msg.code ? {bindStatus: false} : {
            ...action.msg,
            bindStatus: true
        }
    },
    [Action.UNBIND_THIRDPARTY_ACCOUNT]: (state, action) => {
        let thirdPartyList = _.cloneDeep(state.thirdPartyList);
        thirdPartyList = thirdPartyList.filter(item => {
            return item.from != action.thirdPartyType
        })
        return {
            thirdPartyList
        }
    },
    [Action.CLEAR_TOKEN]: (state, action) => {
        cookie.remove('access_token', {path: '/'});
        cookie.remove('refresh_token', {path: '/'});
        return {
            access_token: null,
            refresh_token: null
        }
    },
    [Action.UPDATE_USER]: (state, action) => {
        return {
            userName: action.userName,
            moblie: action.mobile,
            avatarTimestamp: +new Date()
        }
    },
    [Action.GET_ACCOUNT_LIST]: (state, action) => {
        return {
            thirdPartyList: action.msg.data
        }
    },
    [Action.CHANGE_LANG]: (state, action) => {
        if(state.lang=='zh'){
            localStorage.lang='en';
            return {
                lang:'en'
            }
        }else{
            localStorage.lang='zh';
            return {
                lang:'zh'
            }
        }
    }
}


export function user(state = initialState, action) {
    const reduceFn = reducersMap[action.type];
    if (!reduceFn) {
        return state;
    }
    return Object.assign({}, state, reduceFn(state, action))
}