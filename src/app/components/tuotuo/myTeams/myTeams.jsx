import {connect} from 'react-redux';
import {CSSTransitionGroup} from 'react-transition-group'
import {getMyTeams, teamImgLoad} from '../../../actions/Teams';
import Cards from './../common/cards';
import {Link, Redirect} from 'react-router-dom';
import {Card, Row, Col} from 'antd';
import team_i18n from '../../../i18n/team_i18n';


@connect(state => {
    return {
        user: state.user,
        projects: state.projects,
        teams: state.teams
    }
}, dispatch => {
    return {
        getMyTeams: (accessToken, refreshToken) => dispatch(getMyTeams(accessToken, refreshToken)),
        teamImgLoad: (accessToken, teamID, avatar) => dispatch(teamImgLoad(accessToken, teamID, avatar)),
    }
})
class MyTeams extends React.Component {
    constructor(props) {
        super(props);
        const {user, getMyTeams}=props;
        getMyTeams(user.access_token, user.refresh_token);
    }

    redirect(uri) {
        const {history}=this.props;
        history.push(uri);
    }

    render() {
        const {user, teams, teamImgLoad, history}=this.props;
        const teamList = teams.teams.length > 0 && _.reverse(_.cloneDeep(teams.teams));
        const teamI18n = team_i18n[user.lang];
        return <div className="homePage page-cont clearfix">
            <Row type="flex" justify="space-between">
                <Col span={12}><h2>{teamI18n.myTeam}</h2></Col>
            </Row>
            <Row className="cardList clearfix">
                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 8}} lg={{span: 6}}>
                    <Card className="card card-add" onClick={() => this.redirect('/tuotuo/addteam')}>
                        <i className="card-add-icon iconfont icon-plus-circle"/>
                        <p className="card-add-word">{teamI18n.newTeam}</p>
                    </Card>
                </Col>
                {teamList && teamList.map((item, i) => (
                    <Cards key={i} info={item} accessToken={user.access_token}
                           imgLoad={teamImgLoad.bind(null, user.access_token, item.teamID)} type="team"
                           isBackIcon={true} history={history}/>))}

            </Row>
        </div>
    }
}

export default MyTeams;