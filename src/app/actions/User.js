/**
 * Created by AllenFeng on 2017/3/24.
 */
import {user as Action} from '../constants/actionType';
import {apihost} from '../constants/apiConfig';
import {request} from '../utils/request';
import {resCode} from '../constants/common';
import {getNewAccessToken} from './RefreshToken'

export function getUser(accessToken, refreshToken) {
    return (dispatch) => {
        return request(`${apihost}/user/MyUserInfo`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            }
        }).then(res => res.json()).then(json => {
                if (json.code != resCode.UnAuthenticate) {
                    return dispatch({
                        type: Action.GET_USER,
                        user: json.data
                    })
                } else {
                    return getNewAccessToken(dispatch, refreshToken, getUser)
                }
            }
        )
    }
}

export function login(mail, password) {
    return (dispatch) => {
        dispatch(pending());
        return request(`${apihost}/token`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=password&username=${encodeURIComponent(mail)}&password=${encodeURIComponent(password)}`
        }).then(res => {
            return res.json()
        }).then(json => dispatch({
            type: Action.LOGIN_USER,
            msg: json
        }))
    }
}

export function unbindUser(accessToken, refreshToken, thirdPartyType) {
    return dispatch => {
        return request(`${apihost}/user/unBindThirdPartyAccount`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                thirdPartyType
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.UNBIND_THIRDPARTY_ACCOUNT,
                    thirdPartyType
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, unbindUser)
            }
        })
    }
}

export function loadAuthImg(identityCode) {
    return (dispatch) => {
        return request(`${apihost}/user/getAuthpic`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            queryParams: {
                identity: identityCode,
                width: 100,
                height: 40
            }
        }).then(res => res.blob()).then(blob => {
            let objUrl = URL.createObjectURL(blob);
            return dispatch({
                type: Action.LOAD_AUTH_IMG,
                authImg: objUrl
            })
        })
    }
}

export function sendMail(mail, code, codeType, identity, reSendEmailToken) {
    return (dispatch) => {
        dispatch(pending());
        return request(`${apihost}/user/SendAuthMail`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                code,
                codeType,
                identity,
                reSendEmailToken
            })
        }).then(res => res.json()).then(json => {
            return dispatch({
                type: Action.SEND_MAIL,
                authCode: json.code,
                mail: json.data && json.data.mail,
                reSendMailToken: json.data && json.data.reSendMailToken
            })
        })
    }
}

export function verifyEmailCode(mail, code, codeType) {
    return (dispatch) => {
        return request(`${apihost}/user/VerifyEmailAuthCode`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                code,
                codeType
            })
        }).then(res => res.json()).then(json => {
            return dispatch({
                type: Action.VERIFY_MAIL_CODE,
                mailAuthCode: json.code,
                submitToken: json.data && json.data.submitToken
            })
        })
    }
}

export function registUser(mail, password, submitToken, redisId) {
    return (dispatch) => {
        return request(`${apihost}/user/RegisterUser`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                password,
                submitToken,
                redisId
            })
        }).then(res => res.json()).then(json => {
            return dispatch({
                type: Action.REGIST_USER,
                msg: json
            })
        })
    }
}

export function editPassword(mail, password, submitToken) {
    return (dispatch) => {
        return request(`${apihost}/user/ResetPassword`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                password,
                submitToken
            })
        }).then(res => res.json()).then(json => {
            return dispatch({
                type: Action.EDIT_PASSWORD,
                msg: json
            })
        })
    }
}

export function thirdLogin(code, redirectUri, agent) {
    return (dispatch) => {
        return request(`${apihost}/${agent}`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
            queryParams: {
                code,
                redirectUri
            }
        }).then(res => res.json()).then(json => {
            return dispatch({
                type: Action.THIRD_LOGIN,
                msg: json
            })
        })
    }
}

export function thirdLoginInner(accessToken, refreshToken,code, redirectUri, agent,state='inner') {
    return (dispatch) => {
        return request(`${apihost}/${agent}`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                code,
                redirectUri,
                state
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type:Action.THIRD_BIND_INNER,
                    msg:json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, thirdLoginInner, {
                    code,
                    redirectUri,
                    agent,
                    state
                })
            }
        })
    }
}

export function bindUser(mail, redisId, submitToken) {
    return async function (dispatch) {
        let res = await request(`${apihost}/user/BindUser`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                redisId,
                submitToken
            })
        });
        let json = await res.json();
        return dispatch({
            type: Action.BIND_USER,
            msg: json
        })
    }
}

export function bindUserV2(mail, password, redisId) {
    return async function (dispatch) {
        let res = await request(`${apihost}/user/BindUserV2`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                password,
                redisId
            })
        });
        let json = await res.json();
        return dispatch({
            type: Action.BIND_USER,
            msg: json
        })
    }
}

export function updatePassword(accessToken, refreshToken, mail, oldPassword, newPassword) {
    return (dispatch) => {
        return request(`${apihost}/user/ChangePassword`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail,
                oldPassword,
                newPassword
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return {
                    msg: json
                }
            } else {
                return getNewAccessToken(dispatch, refreshToken, updatePassword, {
                    mail,
                    oldPassword,
                    newPassword
                })
            }
        })
    }
}

export function updateUser(accessToken, refreshToken, userName, avatarToken, mobile) {
    return (dispatch) => {
        return request(`${apihost}/user/ModifyMyUserInfo`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName,
                avatarToken,
                mobile
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.UPDATE_USER,
                    msg: json,
                    userName,
                    mobile
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, updatePassword, {
                    mail,
                    oldPassword,
                    newPassword
                })
            }
        })
    }
}

export function getBindThirdPartyAccountList(accessToken, refreshToken) {
    return (dispatch) => {
        return request(`${apihost}/user/GetBindThirdPartyAccountList`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_ACCOUNT_LIST,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getBindThirdPartyAccountList)
            }
        })
    }
}

export function resetAuthStatus() {
    return {
        type: Action.RESET_AUTH_STATUS
    }
}

export function pending() {
    return {
        type: Action.ISFETCH
    }
}

export function clearToken() {
    return {
        type: Action.CLEAR_TOKEN
    }
}

export function changeLang() {
    return {
        type:Action.CHANGE_LANG
    }
}