import {connect} from 'react-redux';
import {CSSTransitionGroup} from 'react-transition-group'
import {getMyProjects, projectImgLoad} from '../../../actions/Projects';
import Cards from './../common/cards';
import {Link, Redirect} from 'react-router-dom';
import {Card, Row, Col} from 'antd';
import project_i18n from '../../../i18n/project_i18n';


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
    }
})
class Myprojects extends React.Component {
    constructor(props) {
        super(props);
        const {getMyProjects, user}=props;
        getMyProjects(user.access_token, user.refresh_token);
    }

    redirect(uri) {
        const {history}=this.props;
        history.push(uri)
    }

    render() {
        const {user, projects, projectImgLoad, history}=this.props;
        const projectList = projects.projects.length > 0 && _.reverse(_.cloneDeep(projects.projects));
        const projectI18n = project_i18n[user.lang];
        return <div className="homePage page-cont clearfix">
            <Row type="flex" justify="space-between">
                <Col span={12}><h2>{projectI18n.myProject}</h2></Col>
            </Row>
            <Row className="cardList clearfix">
                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 8}} lg={{span: 6}}>
                    <Card className="card card-add" onClick={() => this.redirect('/tuotuo/addproject')}>
                        <i className="card-add-icon iconfont icon-plus-circle"/>
                        <p className="card-add-word">{projectI18n.newProject}</p>
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

export default Myprojects;