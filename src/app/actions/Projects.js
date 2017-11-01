/**
 * Created by AllenFeng on 2017/5/26.
 */
// import {projects as Action,teams as ActionB} from '../constants/actionType';
import {projects as Action,user as ActionUser} from '../constants/actionType';
import {apihost} from '../constants/apiConfig';
import {request} from '../utils/request';
import {resCode} from '../constants/common';
import {getNewAccessToken} from './RefreshToken'

export function getMyProjects(accessToken, refreshToken) {
    return (dispatch) => {
        return request(`${apihost}/project/GetMyProjects`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_MY_PROJECTS,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getMyProjects)
            }
        })
    }
}

export function addProjects(accessToken, refreshToken, projectName, projectSummary, avatarToken) {
    return (dispatch) => {
        return request(`${apihost}/project`, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectName,
                projectSummary,
                avatarToken
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                dispatch({
                    type:ActionUser.ADD_ROLE,
                    roleType:2,
                    relationID:json.projectID
                })
                return dispatch({
                    type: Action.ADD_PROJECTS,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, addProjects, {
                    projectName,
                    projectSummary,
                    avatarToken
                })
            }
        })
    }
}

export function getProjectDetail(accessToken, refreshToken, projectID) {
    return (dispatch) => {
        return request(`${apihost}/project`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                projectID
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_PROJECT_DETAIL,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getProjectDetail, {
                    projectID
                })
            }
        })
    }
}

export function changeProjectMemberRole(accessToken, refreshToken, projectID, mail, roleCode) {
    return (dispatch) => {
        return request(`${apihost}/project/changeMemberRole`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
                mail,
                roleCode
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.CHANGE_PROJECT_MEMBER_ROLE,
                    msg: json,
                    mail,
                    roleCode
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, changeProjectMemberRole, {
                    projectID,
                    mail,
                    roleCode
                })
            }
        })
    }
}

export function changeProjectMemberTags(accessToken, refreshToken, projectID, mail, tags) {
    return (dispatch) => {
        return request(`${apihost}/project/ChangeMemberTags`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
                mail,
                tags
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.CHANGE_PROJECT_MEMBER_TAGS,
                    msg: json,
                    mail,
                    tags
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, changeProjectMemberTags, {
                    projectID,
                    mail,
                    tags
                })
            }
        })
    }
}

export function exitProject(accessToken, refreshToken, projectID, mail) {
    return (dispatch) => {
        return request(`${apihost}/project/ExitProject`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EXIT_PROJECT,
                    msg: json,
                    mail
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, exitProject, {
                    projectID,
                    mail
                })
            }
        })
    }
}

export function invite(accessToken, refreshToken, projectID, mails) {
    return (dispatch) => {
        return request(`${apihost}/project/InviteMembers`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
                mails
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.INVITE_PROJECT_MEMBERS,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, invite, {
                    projectID,
                    mails
                })
            }
        })
    }
}

export function editProject(accessToken, refreshToken, projectID, projectName, projectSummary, avatarToken) {
    return (dispatch) => {
        return request(`${apihost}/project`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
                projectName,
                projectSummary,
                avatarToken
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EDIT_PROJECT,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, editProject, {
                    projectID,
                    projectName,
                    projectSummary
                })
            }
        })
    }
}

export function projectImgLoad(accessToken, projectID, avatar) {
    return (dispatch) => {
        return request(`${apihost}/project/ViewProjectAvatar`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            },
            queryParams: {
                projectID,
                avatar
            }
        }).then(res => {
            let contentType = res.headers.get('content-type');
            if (contentType == 'application/json') {
                return {
                    code: 400,
                    msg: res.json()
                }
            }
            return {
                code: 200,
                blob: res.blob()
            }
        }).then(img => {
            if (img.code == 200) {
                img.blob.then(blob => {
                    let bgUrl = URL.createObjectURL(blob);
                    dispatch({
                        type: Action.LOAD_PROJECT_IMG,
                        bgUrl,
                        projectID
                    })
                })
            } else {
                let bgUrl = '/image/setPass.png';
                dispatch({
                    type: Action.LOAD_PROJECT_IMG,
                    bgUrl,
                    projectID
                })
            }
        })
    }
}

export function deleteProject(accessToken, refreshToken, projectID) {
    return (dispatch) => {
        return request(`${apihost}/project`, {
            mode: 'cors',
            method: 'delete',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.DELETE_PROJECT,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteProject, {
                    projectID
                })
            }
        })
    }
}

export function removeMember(accessToken, refreshToken, projectID, mail) {
    return (dispatch) => {
        return request(`${apihost}/project/RemoveMember`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
                mail
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.REMOVE_PROJECT_MEMBER,
                    msg: json,
                    mail
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, removeMember, {
                    projectID,
                    mail
                })
            }
        })
    }
}

export function transformProject(accessToken, refreshToken, projectID, mail) {
    return (dispatch)=>{
        return request(`${apihost}/project/TransformProject`,{
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID,
                mail
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.TRANSFORM_PROJECT,
                    msg: json,
                    mail
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, transformProject, {
                    projectID,
                    mail
                })
            }
        })
    }
}

//backlog中使用
export function getMemberProjects(accessToken, refreshToken,mail) {
    return (dispatch) => {
        return request(`${apihost}/project/GetProjectListByMail`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                mail
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_MEMBER_PROJECTS,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getMemberProjects, {
                    mail
                })
            }
        })
    }
}

export function initProject() {
    return {
        type:Action.INIT_PROJECT
    }
}