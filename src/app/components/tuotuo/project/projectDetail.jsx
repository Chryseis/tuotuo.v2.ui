/**
 * Created by AllenFeng on 2017/6/2.
 */
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
    getProjectDetail,
    changeProjectMemberTags,
    changeProjectMemberRole,
    exitProject,
    invite,
    removeMember
} from '../../../actions/Projects';
import { searchTeam} from '../../../actions/Teams';
import {openSlider} from '../../../actions/Slider'
import MemberCards from '../common/memberCards';
import InviteMembers from '../common/inviteMembers';
import {sliderName} from '../../../constants/common'
import {Tooltip, Row} from 'antd';
import BackToMain from '../common/backToMain';
import project_i18n from '../../../i18n/project_i18n';

@connect(state => {
    return {
        user: state.user,
        projects: state.projects,
        teams:state.teams,
    }
}, dispatch => {
    return {
        getProjectDetail: (accessToken, refreshToken, projectId) => dispatch(getProjectDetail(accessToken, refreshToken, projectId)),
        changeProjectMemberTags: (accessToken, refreshToken, projectId, mail, tags) => dispatch(changeProjectMemberTags(accessToken, refreshToken, projectId, mail, tags)),
        changeProjectMemberRole: (accessToken, refreshToken, projectID, mail, roleCode) => dispatch(changeProjectMemberRole(accessToken, refreshToken, projectID, mail, roleCode)),
        exitProject: (accessToken, refreshToken, projectId, mail) => dispatch(exitProject(accessToken, refreshToken, projectId, mail)),
        openSlider: (nodeName) => dispatch(openSlider(nodeName)),
        searchTeam: (accessToken, refreshToken, searchName) => dispatch(searchTeam(accessToken, refreshToken, searchName)),
        invite: (accessToken, refreshToken, projectID, mails) => dispatch(invite(accessToken, refreshToken, projectID, mails)),
        removeMember:(accessToken, refreshToken, projectID, mail) => dispatch(removeMember(accessToken, refreshToken, projectID, mail)),
    }
})
class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
        const {user, getProjectDetail, match}=props;
        this.state = {
            inviteMemberVisible: false
        }
        getProjectDetail(user.access_token, user.refresh_token, match.params.id);
    }

    setInviteModaVisible(inviteMemberVisible) {
        this.setState({
            inviteMemberVisible
        })
    }

    render() {
        const {user, projects,teams, changeProjectMemberTags, changeProjectMemberRole, exitProject, history, openSlider, searchTeam, invite, getProjectDetail, match,removeMember}=this.props;
        const projectI18n = project_i18n[user.lang]
        let userMail =user.mail;
        let self = projects.project&&_.find(projects.project.members, (member) => {
                return member.memberMail == userMail;
            });
        let owner = projects.project&&_.find(projects.project.members, (member) => {
            return member.roleCode == 'OWNER'
        });
        return <div className="pro-Team" ref={(dom)=>this.dom = dom}>
            <div className="pt-hd">
                <div className="pt-hd-cont page-cont clearfix">
                    <h1>{projects.project && projects.project.info.projectName}</h1>
                    <Tooltip title={self&&self.roleCode !="MEMBER" ? projectI18n.projectSetting:projectI18n.projectInformation}>
                        <a className="pt-setting">
                            <i  className={classnames({"iconfont":true, "icon-settings":self&&self.roleCode !="MEMBER","icon-information":self&&self.roleCode=="MEMBER"})} onClick={openSlider.bind(null, sliderName.EditProject)}/>
                        </a>
                    </Tooltip>
                    <p className="summary">{projects.project && projects.project.info.projectSummary}</p>
                </div>
            </div>
            <div className="pt-bd page-cont">
                <div className="clearfix">
                    <h2>{projectI18n.projectMember} <em>{projects.project && projects.project.members.length}</em></h2>
                </div>
                <Row gutter={20} className="memberList">
                    {projects.project && projects.project.members.length > 0 && projects.project.members.map((item, i) => {
                        return <MemberCards key={i}
                                            dom = {this.dom}
                                            type="项目"
                                            i18n={projectI18n}
                                            userRole={self&&self.roleCode}
                                            member={item}
                                            changeMemberTag={changeProjectMemberTags.bind(null,user.access_token,user.refresh_token,match.params.id)}
                                            changeMemberRoleCode={changeProjectMemberRole.bind(null,user.access_token,user.refresh_token,match.params.id)}
                                            accessToken={user.access_token}
                                            refreshToken={user.refresh_token}
                                            exit={exitProject.bind(null,user.access_token,user.refresh_token,match.params.id)}
                                            history={history}
                                            ownerMail={owner.memberMail}
                                            userMail={user.mail}
                                            removeMember={removeMember.bind(null,user.access_token,user.refresh_token,match.params.id)}/>
                    })}
                </Row>
            </div>
            {self&&self.roleCode !="MEMBER"&&
                <a className="add-member" onClick={this.setInviteModaVisible.bind(this, true)}>
                    <i className="iconfont icon-user-add"/>
                </a>
            }
            <InviteMembers visible={this.state.inviteMemberVisible}
                           onCancel={this.setInviteModaVisible.bind(this, false)} inviteMembers={projects.inviteMembers}
                           searchTeam={searchTeam.bind(null, user.access_token, user.refresh_token)}
                           searchList={teams.searchList}
                           invite={invite.bind(null, user.access_token, user.refresh_token, match.params.id)}
                           getDetail={getProjectDetail.bind(null, user.access_token, user.refresh_token, match.params.id)}
            />
            <BackToMain history={history} />
        </div>
    }
}

export default ProjectDetail;