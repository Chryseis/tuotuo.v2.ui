/**
 * Created by AllenFeng on 2017/6/14.
 */
import {teams as Action} from '../constants/actionType';
import {resCode} from '../constants/common';

const initialState = {
    teams: [],
    team: null,
    memberList: [],
    isAddSuccess: false,
    inviteMembers: {},
    searchList: {},
    isDeleteSuccess: false,
};

const reducersMap = {
    [Action.GET_MY_TEAMS]: (state, action) => {
        return {teams: action.msg.data}
    },
    [Action.ADD_TEAMS]: (state, action) => {
        return {isAddSuccess: true}
    },
    [Action.GET_TEAM_DETAIL]: (state, action) => {
        return {team: action.msg.data}
    },
    [Action.LOAD_TEAM_IMG]: (state, action) => {
        let team = _.find(state.teams, (item) => {
            return item.teamID == action.teamID
        })
        team && (team.bgUrl = action.bgUrl);
    },
    [Action.GET_MEMBER_LIST]: (state, action) => {
        return {
            memberList: action.msg.data
        }
    },
    [Action.CHANGE_TEAM_MEMBER_TAGS]: (state, action) => {
        let team = _.cloneDeep(state.team);
        if (action.msg.code == resCode.OK) {
            let member = _.find(team.members, (member) => {
                return member.memberMail == action.mail
            })
            member.tags = action.tags;
        }
        return {team}
    },
    [Action.CHANGE_TEAM_MEMBER_ROLE]: (state, action) => {
        let team = _.cloneDeep(state.team);
        if (action.msg.code == resCode.OK) {
            let member = _.find(team.members, (member) => {
                return member.memberMail == action.mail
            })
            member.roleCode = action.roleCode;
        }
        return {team}
    },
    [Action.EXIT_TEAM]: (state, action) => {
        let team = _.cloneDeep(state.team);
        if (action.msg.code == resCode.OK) {
            _.remove(team.members, (member) => {
                return member.memberMail == action.mail
            })
        }
        return {team}
    },
    [Action.SEARCH_TEAM]: (state, action) => {
        if (action.msg.code == resCode.OK) {
            return {
                searchList: action.msg.data
            }
        }
    },
    [Action.INVITE_TEAM_MEMBERS]: (state, action) => {
        if (action.msg.code == resCode.OK) {
            return {
                inviteMembers: Object.assign({}, state.inviteMembers, action.msg.data)
            }
        }
    },
    [Action.DELETE_TEAM]: (state, action) => {
        return {isDeleteSuccess: true}
    },
    [Action.REMOVE_TEAM_MEMBER]: (state, action) => {
        let team = _.cloneDeep(state.team);
        if (action.msg.code == resCode.OK) {
            _.remove(team.members, (member) => {
                return member.memberMail == action.mail
            })
        }
        return {team}
    },
    [Action.TRANSFORM_TEAM]: (state, action) => {
        let team = _.cloneDeep(state.team);
        if (action.msg.code == resCode.OK) {
            let oldOwner = _.find(team.members, (member) => {
                return member.roleCode == 'OWNER'
            })
            oldOwner.roleCode = 'MEMBER'

            let member = _.find(team.members, (member) => {
                return member.memberMail == action.mail
            })
            member.roleCode = 'OWNER';
        }
        return {team}
    },
    [Action.EDIT_TEAM]: (state, action) => {
        return {
            team: action.msg.data
        }
    }
};


export function teams(state = initialState, action) {
    const reduceFn = reducersMap[action.type];
    if (!reduceFn) {
        return state;
    }
    return Object.assign({}, state, reduceFn(state, action))
}