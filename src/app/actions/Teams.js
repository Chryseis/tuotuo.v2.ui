/**
 * Created by AllenFeng on 2017/6/14.
 */
import {teams as Action,user as ActionUser} from '../constants/actionType';
import {apihost} from '../constants/apiConfig';
import {request} from '../utils/request';
import {resCode} from '../constants/common';
import {getNewAccessToken} from './RefreshToken';


export function getMyTeams(accessToken, refreshToken) {
    return (dispatch) => {
        return request(`${apihost}/team/GetMyTeams`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_MY_TEAMS,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getMyTeams)
            }
        })
    }
}

export function addTeams(accessToken, refreshToken, teamName, teamSummary, avatarToken) {
    return (dispatch) => {
        return request(`${apihost}/team`, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName,
                teamSummary,
                avatarToken
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                dispatch({
                    type:ActionUser.ADD_ROLE,
                    roleType:1,
                    relationID:json.data.info.teamID
                })
                return dispatch({
                    type: Action.ADD_TEAMS,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, addTeams, {
                    teamName,
                    teamSummary,
                    avatarToken
                })
            }
        })
    }
}

export function getTeamDetail(accessToken, refreshToken, teamID) {
    return (dispatch) => {
        return request(`${apihost}/team`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                teamID
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_TEAM_DETAIL,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getTeamDetail, {
                    teamID
                })
            }
        })
    }
}

export function teamImgLoad(accessToken, teamID, avatar) {
    return (dispatch) => {
        return request(`${apihost}/team/ViewTeamAvatar`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            },
            queryParams: {
                teamID,
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
                        type: Action.LOAD_TEAM_IMG,
                        bgUrl,
                        teamID
                    })
                })
            } else {
                let bgUrl = '/image/setPass.png';
                dispatch({
                    type: Action.LOAD_TEAM_IMG,
                    bgUrl,
                    teamID
                })
            }
        })
    }
}
//g更新团队
export function editTeam(accessToken, refreshToken, teamID, teamName, teamSummary, avatarToken) {
    return (dispatch) => {
        return request(`${apihost}/team`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                teamName,
                teamSummary,
                avatarToken
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EDIT_TEAM,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, editTeam, {
                    teamID,
                    teamName,
                    teamSummary
                })
            }
        })
    }
}

export function deleteTeam(accessToken, refreshToken, teamID) {
    return (dispatch) => {
        return request(`${apihost}/team`, {
            mode: 'cors',
            method: 'delete',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.DELETE_TEAM,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteTeam, {
                    teamID
                })
            }
        })
    }
}

export function invite(accessToken, refreshToken, teamID, mails) {
    return (dispatch) => {
        return request(`${apihost}/team/InviteMembers`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                mails
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.INVITE_TEAM_MEMBERS,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, invite, {
                    teamID,
                    mails
                })
            }
        })
    }
}

export function exitTeam(accessToken, refreshToken, teamID, mail) {
    return (dispatch) => {
        return request(`${apihost}/team/ExitTeam`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EXIT_TEAM,
                    msg: json,
                    mail
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, exitTeam, {
                    teamID,
                    mail
                })
            }
        })
    }
}

export function transformTeam(accessToken, refreshToken, teamID, mail) {
    return (dispatch)=>{
        return request(`${apihost}/team/TransformTeam`,{
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                mail
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.TRANSFORM_TEAM,
                    msg: json,
                    mail
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, transformTeam, {
                    teamID,
                    mail
                })
            }
        })
    }
}

export function removeMember(accessToken, refreshToken, teamID, mail) {
    return (dispatch) => {
        return request(`${apihost}/team/RemoveMember`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                mail
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.REMOVE_TEAM_MEMBER,
                    msg: json,
                    mail
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, removeMember, {
                    teamID,
                    mail
                })
            }
        })
    }
}
//
export function memberList(accessToken, refreshToken, teamID) {
    return (dispatch) => {
        return request(`${apihost}/team/MemberList`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_MEMBER_LIST,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, memberList, {
                    teamID
                })
            }
        })
    }
}

//修改团队用户角色
export function changeTeamMemberRole(accessToken, refreshToken, teamID, mail, roleCode) {
    return (dispatch) => {
        return request(`${apihost}/team/changeMemberRole`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                mail,
                roleCode
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.CHANGE_TEAM_MEMBER_ROLE,
                    msg: json,
                    mail,
                    roleCode
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, changeTeamMemberRole, {
                    teamID,
                    mail,
                    roleCode
                })
            }
        })
    }
}

//修改团队用户标签
export function changeTeamMemberTags(accessToken, refreshToken, teamID, mail, tags) {
    return (dispatch) => {
        return request(`${apihost}/team/ChangeMemberTags`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                mail,
                tags
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.CHANGE_TEAM_MEMBER_TAGS,
                    msg: json,
                    mail,
                    tags
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, changeTeamMemberTags, {
                    teamID,
                    mail,
                    tags
                })
            }
        })
    }
}

export function searchTeam(accessToken, refreshToken, searchName) {
    return (dispatch) => {
        return request(`${apihost}/team/SearchTeam`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchName
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.SEARCH_TEAM,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, searchTeam, {
                    searchName
                })
            }
        })
    }
}

export function initProject() {
    return {
        type:Action.INIT_TEAM
    }
}





// export function getMemberTeams(accessToken, refreshToken,mail) {
//     return (dispatch) => {
//         return request(`${apihost}/team/GetTeamListByMail`, {
//             mode: 'cors',
//             method: 'get',
//             headers: {
//                 'Authorization': `bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             },
//             queryParams: {
//                 mail
//             }
//         }).then(res => res.json()).then(json => {
//             if (json.code != resCode.UnAuthenticate) {
//                 return dispatch({
//                     type: Action.GET_MEMBER_TEAMS,
//                     msg: json
//                 })
//             } else {
//                 return getNewAccessToken(dispatch, refreshToken, getMemberTeams, {
//                     mail
//                 })
//             }
//         })
//     }
// }