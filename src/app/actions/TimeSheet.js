/**
 * Created by AllenFeng on 2017/6/14.
 */
import {timeSheet as Action} from '../constants/actionType';
import {apihost} from '../constants/apiConfig';
import {request} from '../utils/request';
import {resCode} from '../constants/common';
import {getNewAccessToken} from './RefreshToken';
export function getMyTimeSheet(accessToken, refreshToken, currentTimeStamp) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/GetMyTimeSheet`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                currentTimeStamp
            }
        }).then(res => res.json()).then(json => {
                if (json.code != resCode.UnAuthenticate) {
                    return dispatch({
                        type: Action.GET_MY_TIMESHEET,
                        msg:json
                    })
                } else {
                    return getNewAccessToken(dispatch, refreshToken, getMyTimeSheet,{
                        currentTimeStamp
                    })
                }
            }
        )
    }
}
export function createTimeSheetTasks(accessToken, refreshToken,sheetID,tasks) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/CreateTimeSheetTasks`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sheetID,
                tasks
            })
        }).then(res => res.json()).then(json => {
            if(json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.CREATE_TIMESHEET_TASKS,
                    msg: json,
                    sheetID,
                    tasks
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, createTimeSheetTasks, {
                    sheetID,
                    tasks
                })
            }
        })
    }
}
export function submitTimeSheet(accessToken, refreshToken, sheetID) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/SubmitTimeSheet`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sheetID,
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.SUBMIT_TIMESHEET,
                    msg: json,
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, submitTimeSheet, {
                    sheetID,
                })
            }
        })
    }
}
//审核
export function approveTimeSheet(accessToken, refreshToken, user, sheetID, result, comment, viewTimeStamp) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/ApproveTimeSheet`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sheetID, result, comment, viewTimeStamp
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.APPROVE_TIMESHEET,
                    msg: json,
                    sheetID, result, comment, viewTimeStamp,
                    user
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, approveTimeSheet, {
                    sheetID,
                })
            }
        })
    }
}
//删除timesheet task
export function deleteTimeSheetTask(accessToken, refreshToken, taskID) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/DeleteTimeSheetTask`, {
            mode: 'cors',
            method: 'delete',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskID
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.DELETE_TIMESHEET_TASK,
                    msg: json,
                    taskID
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, deleteTimeSheetTask, {
                    taskID
                })
            }
        })
    }
}

//更改timesheet task
export function modifyTimeSheetTask(accessToken, refreshToken, taskID, detail, selectProjectID, time) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/ModifyTimeSheetTask`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskID,
                detail,
                selectProjectID,
                time
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.MODIFY_TIMESHEET_TASK,
                    msg: json,
                    taskID,
                    detail,
                    selectProjectID,
                    time
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, modifyTimeSheetTask, {
                    taskID,
                    detail,
                    selectProjectID,
                    time
                })
            }
        })
    }
}

//更改 timeSheet task type
export function changeTaskType(taskList){
    return (dispatch) => {
      return  dispatch({  type: Action.CHANGE_TASK_TYPE, taskList})
    }
}

//select importCompleteTaskList
export function selectImportTask(taskID){
    return (dispatch) => {
        return dispatch({type:Action.SELECT_IMPORT_TASK, taskID})
    }
}
//清空已选中的导入task
export function resetSelectImportTask() {
    return (dispatch) => {
        return dispatch({type: Action.RESET_SELECT_IMPORT_TASK})
    }
}

//获取导出task
export function getMyCompleteTaskList (accessToken, refreshToken, date) {
    return (dispatch) => {
        return request(`${apihost}/task/MyCompleteTaskList`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            queryParams: {
                date
            }
        }).then(res => res.json()).then(json => {
                if (json.code != resCode.UnAuthenticate) {
                    return dispatch({
                        type: Action.MY_COMPLETE_TASKLIST,
                        msg:json
                    })
                } else {
                    return getNewAccessToken(dispatch, refreshToken, getMyCompleteTaskList,{
                        date
                    })
                }
            }
        )
    }
}


export function getQueryParams(accessToken) {
    return request(`${apihost}/timesheet/GetQueryParams`, {
        mode: 'cors',
        method: 'get',
        headers: {
            'Authorization': `bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(json => {
        return json.data;
    })
}

export function queryReportTimeSheetList(accessToken, refreshToken, startTime, endTime, selectTeamIDList=[], selectUserIDList=[], selectProjectIDList=[], from=1, to=10000) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/QueryReportTimeSheetList`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime,
                endTime,
                selectTeamIDList,
                selectUserIDList,
                selectProjectIDList,
                from,
                to
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.QUERY_REPORT_TIMESHEET_LIST,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, queryReportTimeSheetList, {
                    startTime,
                    endTime,
                    selectTeamIDList,
                    selectUserIDList,
                    selectProjectIDList,
                    from,
                    to
                })
            }

        })
    }
}

export function queryCheckTimeSheetList(accessToken, refreshToken, startTime, endTime, selectTeamIDList=[], selectUserIDList=[], selectStatusList=[], from=1, to=10000) {
    return (dispatch) => {
        return request(`${apihost}/timesheet/QueryCheckTimeSheetList`, {
            mode: 'cors',
            method: 'post',
            headers: {
                'Authorization': `bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime,
                endTime,
                selectTeamIDList,
                selectUserIDList,
                selectStatusList,
                from,
                to
            })
        }).then(res => res.json()).then(json => {
            if (json.code != resCode.UnAuthenticate) {
                return dispatch({
                    type: Action.QUERY_CHECK_TIMESHEET_LIST,
                    msg: json
                })
            } else {
                return getNewAccessToken(dispatch, refreshToken, queryCheckTimeSheetList, {
                    startTime,
                    endTime,
                    selectTeamIDList,
                    selectUserIDList,
                    selectStatusList,
                    from,
                    to
                })
            }

        })
    }
}