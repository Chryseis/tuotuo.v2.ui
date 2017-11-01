/**
 * Created by AllenFeng on 2017/6/14.
 */
import {scrum as Action} from '../constants/actionType'
import {apihost} from '../constants/apiConfig';
import {request} from '../utils/request';
import {resCode} from '../constants/common';
import {getNewAccessToken} from './RefreshToken'


export function getBacklogList(accessToken, refreshToken, teamID, sprintID, isCurrent = false) {
    return (dispatch) => {
        return request(`${apihost}/backlog/ListBacklog`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            },
            queryParams: {
                teamID,
                sprintID: isCurrent ? sprintID : 0
            }
        }).then(res => res.json()).then(json => {
            if (isCurrent) {
                if (json.code != resCode.UnAuthenticate) {
                    return dispatch({
                        type: Action.GET_CURRENT_BACKLOG_LIST,
                        msg: json,
                    })
                } else {
                    return getNewAccessToken(dispatch, refreshToken, getBacklogList, {
                        teamID,
                        sprintID,
                        isCurrent
                    })
                }
            } else {
                if (json.code != resCode.UnAuthenticate) {
                    return dispatch({
                        type: Action.GET_BACKLOG_LIST,
                        msg: json,
                    })
                } else {
                    return getNewAccessToken(dispatch, refreshToken, getBacklogList, {
                        teamID,
                        sprintID
                    })
                }
            }
        })
    }
}

export function getReleaseAndSprintList(accessToken, refreshToken, teamID) {
    return (dispatch) => {
        return request(`${apihost}/scrum/ReleaseAndSprintList`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            },
            queryParams: {
                teamID
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_RELEASEANDSPRINT_LIST,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getReleaseAndSprintList, {
                    teamID
                })
            }
        })
    }
}

export function addBackLog(accessToken, refreshToken, teamID, title, content, standard, assignUserMail, selectProjectID, state, level) {
    return (dispatch) => {
        return request(`${apihost}/backlog`, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                title,
                content,
                standard,
                assignUserMail,
                selectProjectID,
                state,
                level
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.ADD_BACKLOG,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, addBackLog, {
                    teamID,
                    title,
                    content,
                    standard,
                    assignUserMail,
                    selectProjectID,
                    state,
                    level
                })
            }
        })
    }
}
export function editBackLog(accessToken, refreshToken, teamID, backlogID, title, content, standard, assignUserMail, selectProjectID, state, level, sprintID) {
    return (dispatch) => {
        return request(`${apihost}/backlog`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                backlogID,
                title,
                content,
                standard,
                assignUserMail,
                selectProjectID,
                state,
                level
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EDIT_BACKLOG,
                    msg: json,
                    backlogID,
                    sprintID
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, editBackLog, {
                    teamID,
                    backlogID,
                    title,
                    content,
                    standard,
                    assignUserMail,
                    selectProjectID,
                    state,
                    level,
                    sprintID
                })
            }
        })
    }
}

export function moveBacklog(accessToken, refreshToken, teamID, sprintID, backlog) {
    return (dispatch) => {
        return request(`${apihost}/backlog/SetBacklogSprint`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                sprintID,
                backlogIDs: [backlog.ID]
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.MOVE_BACKLOG,
                    msg: json,
                    sprintID,
                    backlog
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, moveBacklog, {
                    teamID,
                    sprintID,
                    backlogIDs: [backlog.ID]
                })
            }
        })
    }
}

export function deleteBacklog(accessToken, refreshToken, teamID, sourceType, backlogID) {
    return (dispatch) => {
        return request(`${apihost}/backlog`, {
            mode: 'cors',
            method: 'delete',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                backlogID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.DELETE_BACKLOG,
                    msg: json,
                    teamID,
                    backlogID,
                    sourceType
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteBacklog, {
                    teamID,
                    sourceType,
                    backlogID
                })
            }
        })
    }
}

export function changeSprint(accessToken, refreshToken, teamID, sprint) {
    return (dispatch) => {
        dispatch({
            type: Action.CHANGE_SPRINT,
            sprint
        });
        dispatch(getBacklogList(accessToken, refreshToken, teamID, sprint.ID, true));
    }
}

export function selectCurrentSprint(accessToken, refreshToken, teamID, sprintID) {
    return (dispatch) => {
        return request(`${apihost}/scrum/SetCurrentSprint`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                sprintID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.SELECT_CURRENT_SPRINT,
                    msg: json,
                    teamID,
                    sprintID
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, selectCurrentSprint, {
                    teamID,
                    sprintID
                })
            }
        })
    }
}

export function resetCurrentBacklogList() {
    return {
        type: Action.RESET_CURRENT_BACKLOG_LIST
    }
}

export function createRelease(accessToken, refreshToken, teamID, releaseName, releaseSummary) {
    return (dispatch) => {
        return request(`${apihost}/scrum/CreateRelease`, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                releaseName,
                releaseSummary
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch(getReleaseAndSprintList(accessToken, refreshToken, teamID))
            } else {
                return getNewAccessToken(dispatch, refreshToken, createRelease, {
                    teamID,
                    releaseName,
                    releaseSummary
                })
            }
        })
    }
}

export function changeRelease(releaseID) {
    return {
        type: Action.CHANGE_RELEASE,
        releaseID
    }
}

export function createSprint(accessToken, refreshToken, teamID, releaseID, startTime, endTime) {
    return (dispatch) => {
        return request(`${apihost}/scrum/CreateSprint`, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                releaseID,
                startTime,
                endTime
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.CREATE_SPRINT,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, createSprint, {
                    teamID,
                    releaseID,
                    startTime,
                    endTime
                })
            }
        })
    }
}

export function deleteSprint(accessToken, refreshToken, teamID, sprintID, releaseID) {
    return (dispatch) => {
        return request(`${apihost}/scrum/DeleteSprint`, {
            mode: 'cors',
            method: 'delete',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                sprintID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.DELETE_SPRINT,
                    sprintID,
                    releaseID
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteSprint, {
                    teamID,
                    sprintID
                })
            }
        })
    }
}

export function deleteRelease(accessToken, refreshToken, teamID, releaseID) {
    return (dispatch) => {
        return request(`${apihost}/scrum/DeleteRelease`, {
            mode: 'cors',
            method: 'delete',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                releaseID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return {
                    type: Action.DELETE_RELEASE,
                    msg: json,
                    releaseID
                }
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteSprint, {
                    teamID,
                    releaseID
                })
            }
        })
    }
}


export function getWhiteboardList(accessToken, refreshToken, teamID, sprintID) {
    return (dispatch) => {
        return request(`${apihost}/backlog/ListBacklogAndTask`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            },
            queryParams: {
                teamID,
                sprintID
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_WHITEBOARD_LIST,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getWhiteboardList, {
                    teamID,
                    sprintID
                })
            }
        })
    }
}

export function getCurrentReleaseAndSprint(accessToken, refreshToken, teamID) {
    return (dispatch) => {
        return request(`${apihost}/scrum/GetCurrentReleaseAndSprint`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`
            },
            queryParams: {
                teamID
            }
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_CURRENTRELEASEANDSPRINT,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getCurrentReleaseAndSprint, {
                    teamID
                })
            }
        })
    }
}

export function addTask(accessToken, refreshToken, teamID, projectID, backLogID, title, content, assignedEmail, time, state) {
    return (dispatch) => {
        return request(`${apihost}/task`, {
            mode: 'cors',
            method: 'put',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                projectID,
                backLogID,
                title,
                content,
                assignedEmail,
                time,
                state
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.ADD_TASK,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, addTask, {
                    teamID,
                    projectID,
                    backLogID,
                    title,
                    content,
                    assignedName,
                    assignedEmail,
                    time,
                    state
                })
            }
        })
    }
}

export function editTask(accessToken, refreshToken, teamID, projectID, taskID, title, content, assignedEmail, time, state) {
    return (dispatch) => {
        return request(`${apihost}/task`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                projectID,
                taskID,
                title,
                content,
                assignedEmail,
                time,
                state
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EDIT_TASK,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, editTask, {
                    teamID,
                    projectID,
                    taskID,
                    title,
                    content,
                    assignedName,
                    assignedEmail,
                    time,
                    state
                })
            }
        })
    }
}

export function deleteTask(accessToken, refreshToken, teamID, taskID) {
    return (dispatch) => {
        return request(`${apihost}/task/TaskState`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                taskID,
                state: 4
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.DELETE_TASK,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteTask, {
                    teamID,
                    taskID
                })
            }
        })
    }
}

export function editTaskState(accessToken, refreshToken, teamID, taskID, state) {
    return (dispatch) => {
        return request(`${apihost}/task/TaskState`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamID,
                taskID,
                state
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.EDIT_TASK_STATE,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, editTaskState, {
                    teamID,
                    taskID,
                    state
                })
            }
        })
    }
}

export function getTaskLogList(accessToken, refreshToken, teamID, taskID) {
    return (dispatch) => {
        return request(`${apihost}/task/TaskLogList`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                teamID,
                taskID
            }
        }).then(res=>res.json()).then(json=>{
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.GET_TASK_LOG_LIST,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, getTaskLogList, {
                    teamID,
                    taskID,
                    state
                })
            }
        })
    }
}

export function initWhiteBoard() {
    return {
        type:Action.INIT_WHITEBOARD
    }
}