import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
    getTeamDetail,
    changeTeamMemberTags,
    changeTeamMemberRole,
    exitTeam,
    searchTeam,
    invite,
    removeMember
} from '../../../actions/Teams';
import {openSlider} from '../../../actions/Slider'
import MemberCards from '../common/memberCards';
import InviteMembers from '../common/inviteMembers';
import {sliderName} from '../../../constants/common';
import {Row, Tooltip, Col, Card} from 'antd';
import BackToMain from '../common/backToMain';
import team_i18n from '../../../i18n/team_i18n';

@connect(state => {
    return {
        user: state.user,
        teams: state.teams
    }
}, dispatch => {
    return {
        getTeamDetail: (accessToken, refreshToken, teamId) => dispatch(getTeamDetail(accessToken, refreshToken, teamId)),
        changeTeamMemberTags: (accessToken, refreshToken, teamId, mail, tags) => dispatch(changeTeamMemberTags(accessToken, refreshToken, teamId, mail, tags)),
        changeTeamMemberRole: (accessToken, refreshToken, teamID, mail, roleCode) => dispatch(changeTeamMemberRole(accessToken, refreshToken, teamID, mail, roleCode)),
        exitTeam: (accessToken, refreshToken, teamId, mail) => dispatch(exitTeam(accessToken, refreshToken, teamId, mail)),
        openSlider: (nodeName) => dispatch(openSlider(nodeName)),
        searchTeam: (accessToken, refreshToken, searchName) => dispatch(searchTeam(accessToken, refreshToken, searchName)),
        invite: (accessToken, refreshToken, teamID, mails) => dispatch(invite(accessToken, refreshToken, teamID, mails)),
        removeMember: (accessToken, refreshToken, teamID, mail) => dispatch(removeMember(accessToken, refreshToken, teamID, mail)),
    }
})
class TeamDetail extends React.Component {
    constructor(props) {
        super(props);
        const {user, getTeamDetail, match}=props;
        this.state = {
            inviteMemberVisible: false
        };
        getTeamDetail(user.access_token, user.refresh_token, match.params.id);
    }

    setInviteModaVisible(inviteMemberVisible) {
        this.setState({
            inviteMemberVisible
        })
    }

    render() {
        const {user, teams, changeTeamMemberTags, changeTeamMemberRole, exitTeam, history, openSlider, searchTeam, invite, getTeamDetail, match, removeMember}=this.props;
        const teamI18n = team_i18n[user.lang];
        let userMail = user.mail;
        let self = teams.team && _.find(teams.team.members, (member) => {
                return member.memberMail == userMail;
            });
        let owner = teams.team && _.find(teams.team.members, (member) => {
                return member.roleCode == 'OWNER'
            });
        return <div className="pro-Team" ref={(dom) => this.dom = dom}>
            <div className="pt-hd">
                <div className="pt-hd-cont page-cont clearfix">
                    <h1>{teams.team && teams.team.info.teamName}</h1>
                    <Tooltip
                        title={self && self.roleCode != "MEMBER" ? teamI18n.teamSetting : teamI18n.teamInformation}>
                        <a className="pt-setting">
                            <i className={classnames({
                                "iconfont": true,
                                "icon-settings": self && self.roleCode != "MEMBER",
                                "icon-information": self && self.roleCode == "MEMBER"
                            })} onClick={openSlider.bind(null, sliderName.EditTeam)}/>
                        </a>
                    </Tooltip>
                    <p className="summary">{teams.team && teams.team.info.teamSummary}</p>
                </div>
            </div>
            <div className="pt-bd page-cont">
                <div className="clearfix">
                    <h2>{teamI18n.teamMember} <em>{teams.team && teams.team.members.length}</em></h2>
                </div>
                <Row gutter={20} className="memberList">
                    {teams.team && teams.team.members.length > 0 && teams.team.members.map((item, i) => {
                        return <MemberCards key={i}
                                            dom={this.dom}
                                            i18n={teamI18n}
                                            type="团队"
                                            userRole={self && self.roleCode}
                                            member={item}
                                            changeMemberTag={changeTeamMemberTags.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                            changeMemberRoleCode={changeTeamMemberRole.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                            accessToken={user.access_token}
                                            refreshToken={user.refresh_token}
                                            exit={exitTeam.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                            history={history}
                                            ownerMail={owner.memberMail}
                                            userMail={user.mail}
                                            removeMember={removeMember.bind(null, user.access_token, user.refresh_token, match.params.id)}/>
                    })}
                </Row>
            </div>

            {self && self.roleCode != "MEMBER" &&
            <a className="add-member" onClick={this.setInviteModaVisible.bind(this, true)}>
                <i className="iconfont icon-user-add"/>
            </a>
            }
            <InviteMembers visible={this.state.inviteMemberVisible}
                           onCancel={this.setInviteModaVisible.bind(this, false)} inviteMembers={teams.inviteMembers}
                           searchTeam={searchTeam.bind(null, user.access_token, user.refresh_token)}
                           searchList={teams.searchList}
                           invite={invite.bind(null, user.access_token, user.refresh_token, match.params.id)}
                           getDetail={getTeamDetail.bind(null, user.access_token, user.refresh_token, match.params.id)}
            />
            <BackToMain history={history}/>
        </div>
    }
}

export default TeamDetail;