/**
 * Created by WillWang on 2017/7/5.
 */
import {timeSheet as Action} from '../constants/actionType';
import {resCode} from '../constants/common';

const initialState = {
    timeSheet:null,
    timeSheetTasks: [],
    project: null,
    isAddSuccess: false,
    inviteMembers: {},
    isDeleteSuccess: false,
    timesheetReportList:[],
    timeSheetCheckList:[],
    myCompleteTaskList:[]
};

const reducersMap = {
    [Action.GET_MY_TIMESHEET]: (state, action) => {
        return {timeSheet:action.msg.data.info,timeSheetTasks: action.msg.data.tasks}
    },

    //创建timeSheet tasks
    [Action.CREATE_TIMESHEET_TASKS]: (state, action) => {
        let timeSheetTasks = _.cloneDeep(state.timeSheetTasks).concat(action.msg.data);
        return {timeSheetTasks};
    },

    //提交timeSheet
    [Action.SUBMIT_TIMESHEET]: (state, action) => {
        return {isAddSuccess: true}
    },

    //审核timeSheet
    [Action.APPROVE_TIMESHEET]: (state, action) =>{
        let timeSheetCheckList = _.cloneDeep(state.timeSheetCheckList);
        let data = _.find(timeSheetCheckList,(item) => {
            return item.info.ID == action.sheetID
        })
        Object.assign(data.info,{
            status:2,
            approvalUserID: action.user.userID,
            approvalUserMail: action.user.mail,
            approvalUserName:action.user.userName,
            approvalTime:action.viewTimeStamp,
            approvalResult:action.result,
            approvalComment:action.comment
        })
        return {timeSheetCheckList};
    },

    //删除timeSheet task
    [Action.DELETE_TIMESHEET_TASK]: (state, action) =>{
        let timeSheetTasks = _.cloneDeep(state.timeSheetTasks);
        if (action.msg.code == resCode.OK) {
            _.remove(timeSheetTasks, (task) => {
                return task.ID == action.taskID
            })
        }
        return {timeSheetTasks};
    },

    //更改timeSheet task
    [Action.MODIFY_TIMESHEET_TASK]: (state, action) =>{
        let timeSheetTasks = _.cloneDeep(state.timeSheetTasks);
        let task = _.find(timeSheetTasks, (task) => {
            return task.ID == action.taskID
        });
        Object.assign(task, {detail:action.detail,projectID:action.selectProjectID,time:action.time});
        return {timeSheetTasks};
    },

    //修改task 的type类型
    [Action.CHANGE_TASK_TYPE]: (state, action) =>{
        let timeSheetTasks = action.taskList;
        return {timeSheetTasks};
    },

    //myCompleteTaskList选中的task 改变selected状态，没有则附上true
    [Action.SELECT_IMPORT_TASK]: (state, action) => {
        let myCompleteTaskList = _.cloneDeep(state.myCompleteTaskList);
        _.find(myCompleteTaskList, (item) => {
            if(item.taskID == action.taskID){
                item.selected? (item.selected = !item.selected) : (item.selected = true);
            }
        });
        return {myCompleteTaskList};
    },

    //empty selected importTask
    [Action.RESET_SELECT_IMPORT_TASK]: (state, action) => {
        let myCompleteTaskList = _.cloneDeep(state.myCompleteTaskList);
        myCompleteTaskList = _.forEach(myCompleteTaskList,(item) =>{
            if(item.selected){
                delete item.selected}
        });
        return {myCompleteTaskList};
    },

    //timeSheet 查询模型
    [Action.GET_QUERY_PARAMS]: (state, action) =>{


    },

    //审核列表查询
    [Action.QUERY_CHECK_TIMESHEET_LIST]: (state, action) =>{
        return {
            timeSheetCheckList:action.msg.data
        }
    },

    //timeSheet 报表
    [Action.QUERY_REPORT_TIMESHEET_LIST]: (state, action) =>{
        return {
            timesheetReportList:action.msg.data
        }
    },
    [Action.MY_COMPLETE_TASKLIST]: (state, action) => {
        return{
            myCompleteTaskList: action.msg.data
        }
    }
};

export function timeSheet(state = initialState, action) {
    const reduceFn = reducersMap[action.type];
    if (!reduceFn) {
        return state;
    }
    return Object.assign({}, state, reduceFn(state, action))
}