/**
 * Created by AllenFeng on 2017/6/15.
 */
import {scrum as Action} from '../constants/actionType';
import {resCode} from '../constants/common';


const initialState = {
    backlogList: [],
    currentBacklogList: [],
    releaseAndSprintList: [],
    currentSprint: null,
    whiteBoardList: [],
    taskLogList: []
}

const reducersMap = {
    [Action.GET_BACKLOG_LIST]: (state, action) => {
        return {backlogList: action.msg.data}
    },
    [Action.GET_CURRENT_BACKLOG_LIST]: (state, action) => {
        return {currentBacklogList: action.msg.data}
    },
    [Action.RESET_CURRENT_BACKLOG_LIST]: (state, action) => {
        return {currentBacklogList: []}
    },
    [Action.GET_RELEASEANDSPRINT_LIST]: (state, action) => {
        let sourceArray = _.cloneDeep(action.msg.data);
        let currentSprint = null;
        _.forEach(sourceArray, (release, i) => {
            i == 0 ? release.releaseInfo.active = true : release.releaseInfo.active = false
            _.forEach(release.sprintInfoList, (sprint) => {
                if (sprint.state === 1) {
                    sprint.selected = true;
                    currentSprint = {
                        releaseName: release.releaseInfo.releaseName, ...sprint
                    }
                    return;
                }
            })
        })
        return {releaseAndSprintList: sourceArray, currentSprint}
    },
    [Action.ADD_BACKLOG]: (state, action) => {
        let backlogList = _.cloneDeep(state.backlogList);
        backlogList.push(action.msg.data);
        return {backlogList}
    },
    [Action.EDIT_BACKLOG]: (state, action) => {
        let backlogList = action.sprintID == 0 ? _.cloneDeep(state.backlogList) : _.cloneDeep(state.currentBacklogList);
        let backlog = _.find(backlogList, (backlog) => {
            return backlog.ID == action.backlogID
        })
        backlog = Object.assign(backlog, action.msg.data);
        return action.sprintID == 0 ? {backlogList} : {currentBacklogList: backlogList}
    },
    [Action.MOVE_BACKLOG]: (state, action) => {
        let backlogList = _.cloneDeep(state.backlogList);
        let currentBacklogList = _.cloneDeep(state.currentBacklogList)
        if (state.currentSprint) {
            if (action.sprintID == 0) {
                _.remove(currentBacklogList, (backlog) => {
                    return backlog.ID == action.backlog.ID
                })
                backlogList.push(Object.assign({}, action.backlog, {sprintID: 0}))
            } else {
                _.remove(backlogList, (backlog) => {
                    return backlog.ID == action.backlog.ID
                })
                currentBacklogList.push(Object.assign({}, action.backlog, {sprintID: state.currentSprint.sprintID}))
            }
        }
        return {backlogList, currentBacklogList}
    },
    [Action.DELETE_BACKLOG]: (state, action) => {
        let backlogList = _.cloneDeep(state.backlogList);
        let currentBacklogList = _.cloneDeep(state.currentBacklogList)
        if (action.sourceType == 'backlog') {
            _.remove(backlogList, (backlog) => {
                return backlog.ID == action.backlogID
            })
        } else {
            _.remove(currentBacklogList, (backlog) => {
                return backlog.ID == action.backlogID
            })
        }
        return {backlogList, currentBacklogList}
    },
    [Action.CHANGE_SPRINT]: (state, action) => {
        let releaseAndSprintList = _.cloneDeep(state.releaseAndSprintList);
        _.forEach(releaseAndSprintList, (release) => {
            _.forEach(release.sprintInfoList, (sprint) => {
                if (sprint.ID === action.sprint.ID) {
                    sprint.selected = true;
                } else {
                    sprint.selected = false;
                }
            })
        })
        return {releaseAndSprintList, currentSprint: action.sprint}
    },
    [Action.SELECT_CURRENT_SPRINT]: (state, action) => {
        let releaseAndSprintList = _.cloneDeep(state.releaseAndSprintList);
        _.forEach(releaseAndSprintList, (release) => {
            _.forEach(release.sprintInfoList, (sprint) => {
                if (sprint.ID === action.sprintID) {
                    sprint.state = 1;
                } else {
                    sprint.state = 0;
                }
            })
        })
        return {releaseAndSprintList}
    },
    [Action.CHANGE_RELEASE]: (state, action) => {
        let releaseAndSprintList = _.cloneDeep(state.releaseAndSprintList);
        releaseAndSprintList.forEach((item, i) => {
            if (item.releaseInfo.ID == action.releaseID) {
                item.releaseInfo.active = true;
            } else {
                item.releaseInfo.active = false;
            }
        })
        return {releaseAndSprintList}
    },
    [Action.CREATE_SPRINT]: (state, action) => {
        let releaseAndSprintList = _.cloneDeep(state.releaseAndSprintList);
        let releaseAndSprint = _.find(releaseAndSprintList, (item) => {
            return item.releaseInfo.ID == action.msg.data.releaseID
        })
        releaseAndSprint.sprintInfoList.push(action.msg.data);
        return {releaseAndSprintList}
    },
    [Action.DELETE_SPRINT]: (state, action) => {
        let releaseAndSprintList = _.cloneDeep(state.releaseAndSprintList);
        let releaseAndSprint = _.find(releaseAndSprintList, (item) => {
            return item.releaseInfo.ID == action.releaseID
        })
        _.remove(releaseAndSprint.sprintInfoList, (item) => {
            return item.ID == action.sprintID
        })
        return {releaseAndSprintList}
    },
    [Action.GET_WHITEBOARD_LIST]: (state, action) => {
        return {
            whiteBoardList: action.msg.data
        }
    },
    [Action.GET_CURRENTRELEASEANDSPRINT]: (state, action) => {
        return {
            currentSprint: action.msg.data
        }
    },
    [Action.ADD_TASK]: (state, action) => {
        let whiteBoardList = _.cloneDeep(state.whiteBoardList);
        if (action.msg.code == resCode.OK) {
            let whiteBoard = _.find(whiteBoardList, (item) => {
                return item.info.ID == action.msg.data.info.backLogID
            });
            whiteBoard.tasks.push(action.msg.data.info);
        }
        return {whiteBoardList}
    },
    [Action.EDIT_TASK]: (state, action) => {
        let whiteBoardList = _.cloneDeep(state.whiteBoardList);
        if (action.msg.code == resCode.OK) {
            let whiteBoard = _.find(whiteBoardList, (item) => {
                return item.info.ID == action.msg.data.info.backLogID
            });
            let task = _.find(whiteBoard.tasks, (task) => {
                return task.taskID == action.msg.data.info.taskID
            })
            Object.assign(task, action.msg.data.info)
        }
        return {whiteBoardList}
    },
    [Action.EDIT_TASK_STATE]: (state, action) => {
        let whiteBoardList = _.cloneDeep(state.whiteBoardList);
        if (action.msg.code == resCode.OK) {
            let whiteBoard = _.find(whiteBoardList, (item) => {
                return item.info.ID == action.msg.data.info.backLogID
            });
            let task = _.find(whiteBoard.tasks, (task) => {
                return task.taskID == action.msg.data.info.taskID
            })
            Object.assign(task, action.msg.data.info)
        }
        return {whiteBoardList}
    },
    [Action.DELETE_TASK]:(state,action)=>{
        let whiteBoardList = _.cloneDeep(state.whiteBoardList);
        if (action.msg.code == resCode.OK) {
            let whiteBoard = _.find(whiteBoardList, (item) => {
                return item.info.ID == action.msg.data.info.backLogID
            });
            _.remove(whiteBoard.tasks, (task) => {
                return task.taskID == action.msg.data.info.taskID
            })
        }
        return {whiteBoardList}
    },
    [Action.GET_TASK_LOG_LIST]: (state, action) => {
        return {
            taskLogList: action.msg.data
        }
    },
    [Action.INIT_WHITEBOARD]: (state, action) => {
        return {
            whiteBoardList:[],
            taskLogList:[]
        }
    }
}

export function scrum(state = initialState, action) {
    const reduceFn = reducersMap[action.type];
    if (!reduceFn) {
        return state;
    }
    return Object.assign({}, state, reduceFn(state, action))
}