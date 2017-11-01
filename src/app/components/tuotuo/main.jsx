/**
 * Created by AllenFeng on 2017/5/26.
 */
import {connect} from 'react-redux';
import {CSSTransitionGroup} from 'react-transition-group'
import {getMyProjects, projectImgLoad} from '../../actions/Projects';
import {getMyTeams, teamImgLoad} from '../../actions/Teams';
import Cards from './common/cards';
import {Link, Redirect} from 'react-router-dom';
import {apihost} from '../../constants/apiConfig';
import {Card, Row, Col} from 'antd';
import main_i18n from '../../i18n/main_i18n'


@connect(state => {
    return {
        user: state.user,
        projects: state.projects,
        teams: state.teams
    }
}, dispatch => {
    return {
        getMyProjects: (accessToken, refreshToken) => dispatch(getMyProjects(accessToken, refreshToken)),
        projectImgLoad: (accessToken, projectID, avatar) => dispatch(projectImgLoad(accessToken, projectID, avatar)),
        getMyTeams: (accessToken, refreshToken) => dispatch(getMyTeams(accessToken, refreshToken)),
        teamImgLoad: (accessToken, teamID, avatar) => dispatch(teamImgLoad(accessToken, teamID, avatar)),
    }
})
class Main extends React.Component {
    constructor(props) {
        super(props);
        const {getMyProjects, user, getMyTeams}=props;
        getMyProjects(user.access_token, user.refresh_token);
        getMyTeams(user.access_token, user.refresh_token);
    }

    redirect(uri) {
        const {history}=this.props;
        history.push(uri)
    }

    render() {
        const {user, projects, projectImgLoad, teams, teamImgLoad, history}=this.props;
        const teamList = teams.teams.length > 0 && ( teams.teams.length > 7 ? _.reverse(_.slice(_.cloneDeep(teams.teams), -7)) : _.reverse(_.cloneDeep(teams.teams)) );
        const projectList = projects.projects.length > 0 && ( projects.projects.length > 7 ? _.reverse(_.slice(_.cloneDeep(projects.projects), -7)) : _.reverse(_.cloneDeep(projects.projects)) );
        const mainI18n = main_i18n[user.lang];
        return <div className="homePage page-cont clearfix">
            <Row type="flex" justify="space-between">
                <Col span={12}><h2>{mainI18n.myTeam}</h2></Col>
                {teams.teams && teams.teams.length > 7 &&
                <Col span={12}><h2 className="title-right"
                                   onClick={() => this.redirect('/tuotuo/myTeams')}>{mainI18n.more} <i
                    className="iconfont icon-arrow-right"/></h2></Col>}
            </Row>

            <Row className="cardList clearfix">
                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 8}} lg={{span: 6}}>
                    <Card className="card card-add" onClick={() => this.redirect('/tuotuo/addteam')}>
                        <i className="card-add-icon iconfont icon-plus-circle"/>
                        <p className="card-add-word">{mainI18n.newTeam}</p>
                    </Card>
                </Col>
                {teamList && teamList.map((item, i) => (
                    <Cards key={i} info={item} accessToken={user.access_token}
                           imgLoad={teamImgLoad.bind(null, user.access_token, item.teamID)} type="team"
                           isBackIcon={true} history={history}/>))}
            </Row>
            <Row type="flex" justify="space-between">
                <Col span={12}><h2>{mainI18n.myProject}</h2></Col>
                {projects.projects && projects.projects.length > 7 &&
                <Col span={12}><h2 className="title-right"
                                   onClick={() => this.redirect('/tuotuo/myProjects')}>{mainI18n.more} <i
                    className="iconfont icon-arrow-right"/></h2></Col>}
            </Row>
            <Row className="cardList clearfix">
                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 8}} lg={{span: 6}}>
                    <Card className="card card-add" onClick={() => this.redirect('/tuotuo/addproject')}>
                        <i className="card-add-icon iconfont icon-plus-circle"/>
                        <p className="card-add-word">{mainI18n.newProject}</p>
                    </Card>
                </Col>
                {projectList && projectList.map((item, i) => (
                    <Cards key={i} info={item} accessToken={user.access_token}
                           imgLoad={projectImgLoad.bind(null, user.access_token, item.projectID)} type="project"
                           history={history}/>))}
            </Row>
        </div>
    }
}

export default Main;