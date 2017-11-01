/**
 * Created by AllenFeng on 2017/5/31.
 */
import {projects as Action} from '../constants/actionType';
import {resCode} from '../constants/common'


const initialState = {
    projects: [],
    project: null,
    isAddSuccess: false,
    inviteMembers: {},
    searchList: {},
    isDeleteSuccess: false,
    memberProjects: []
}

const reducersMap = {
    [Action.GET_MY_PROJECTS]: (state, action) => {
        return {projects: action.msg.data}
    },
    [Action.ADD_PROJECTS]: (state, action) => {
        return {isAddSuccess: true}
    },
    [Action.GET_PROJECT_DETAIL]: (state, action) => {
        return {project: action.msg.data}
    },
    [Action.CHANGE_PROJECT_MEMBER_TAGS]: (state, action) => {
        let project = _.cloneDeep(state.project);
        if (action.msg.code == resCode.OK) {
            let member = _.find(project.members, (member) => {
                return member.memberMail == action.mail
            })
            member.tags = action.tags;
        }
        return {project}
    },
    [Action.CHANGE_PROJECT_MEMBER_ROLE]: (state, action) => {
        let project = _.cloneDeep(state.project);
        if (action.msg.code == resCode.OK) {
            let member = _.find(project.members, (member) => {
                return member.memberMail == action.mail
            })
            member.roleCode = action.roleCode;
        }
        return {project}
    },
    [Action.EXIT_PROJECT]: (state, action) => {
        let project = _.cloneDeep(state.project);
        if (action.msg.code == resCode.OK) {
            _.remove(project.members, (member) => {
                return member.memberMail == action.mail
            })
        }
        return {project}
    },
    [Action.INVITE_PROJECT_MEMBERS]: (state, action) => {
        if (action.msg.code == resCode.OK) {
            return {
                inviteMembers: Object.assign({}, state.inviteMembers, action.msg.data)
            }
        }
    },
    [Action.LOAD_PROJECT_IMG]: (state, action) => {
        let project = _.find(state.projects, (item) => {
            return item.projectID == action.projectID
        })
        project && (project.bgUrl = action.bgUrl);
    },
    [Action.DELETE_PROJECT]: (state, action) => {
        return {isDeleteSuccess: true}
    },
    [Action.REMOVE_PROJECT_MEMBER]: (state, action) => {
        let project = _.cloneDeep(state.project);
        if (action.msg.code == resCode.OK) {
            _.remove(project.members, (member) => {
                return member.memberMail == action.mail
            })
        }
        return {project}
    },
    [Action.TRANSFORM_PROJECT]: (state, action) => {
        let project = _.cloneDeep(state.project);
        if (action.msg.code == resCode.OK) {
            let oldOwner = _.find(project.members, (member) => {
                return member.roleCode == 'OWNER'
            })
            oldOwner.roleCode = 'MEMBER'

            let member = _.find(project.members, (member) => {
                return member.memberMail == action.mail
            })
            member.roleCode = 'OWNER';
        }
        return {project}
    },
    [Action.GET_MEMBER_PROJECTS]: (state, action) => {
        return {memberProjects: action.msg.data}
    },
    [Action.EDIT_PROJECT]: (state, action) => {
        return {
            project: action.msg.data
        }
    }
}

export function projects(state = initialState, action) {
    const reduceFn = reducersMap[action.type];
    if (!reduceFn) {
        return state;
    }
    return Object.assign({}, state, reduceFn(state, action))
}