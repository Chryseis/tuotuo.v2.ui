/**
 * Created by AllenFeng on 2017/5/26.
 */
import {connect} from 'react-redux';
import {Route, Redirect, Switch, Link, NavLink} from 'react-router-dom';
import Main from './main';
import MyTeams from './myTeams/myTeams';
import MyProjects from './myProjects/myProjects';
import ProjectDetail from './project/projectDetail';
import AddProject from './project/addProject';
import TeamDetail from './team/teamDetail';
import AddTeam from './team/addTeam';
import BackLogList from './scrum/backLogList';
import WhiteBoardList from './scrum/whiteBoardList';
import {closeSlider} from'../../actions/Slider';
import {getUser, clearToken, changeLang} from '../../actions/User'
import {Layout, Avatar, Menu, Dropdown, Popover} from 'antd';
import TimeSheetSubmit from './timesheet/timeSheetSubmit';
import TimeSheetApprove from './timesheet/timeSheetApprove';
import TimeSheetReport from './timesheet/timeSheetReport';
import AboutUs from './about/aboutUs';
import UserCenter from './userCenter/userCenter';
import {apihost}  from '../../constants/apiConfig';
import Fade from './common/fade';
import loading from './decorators/loading'
import main_i18n from '../../i18n/main_i18n'
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
const {Header, Content, Footer} = Layout;

@loading
@connect(state => {
    return {
        user: state.user,
        slider: state.slider,
    }
}, dispatch => {
    return {
        closeSlider: () => dispatch(closeSlider()),
        getUser: (accessToken, refreshToken) => dispatch(getUser(accessToken, refreshToken)),
        clearToken: () => dispatch(clearToken()),
        changeLang: () => dispatch(changeLang())
    }
})
class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeSheetVisible: false,
            newKey: 0,
            popoverVisible: false,
        };
        const {history, closeSlider, user, getUser} = props;
        history.listen((location, action) => {
            closeSlider();
        });

    };

    setTimeSheetVisible() {
        this.setState(prevState => ({
            timeSheetVisible: !prevState.timeSheetVisible,
        }));
    };

    popoverVisible = () => {
        this.setState({
            popoverVisible: false
        });
    };
    handleVisibleChange = (popoverVisible) => {
        this.setState({popoverVisible});
    };

    render() {
        const {user, timeSheet, match, closeSlider, clearToken, slider, history, changeLang} = this.props;
        const mainI18n = main_i18n[user.lang];
        user.lang == 'en' ? moment.locale('en-gb') : moment.locale('zh-cn');
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link className="Menubtn" rel="noopener noreferrer"
                          to="/tuotuo/timesheetreport">{mainI18n.timesheetReport}</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link className="Menubtn" rel="noopener noreferrer"
                          to="/tuotuo/timesheetApprove">{mainI18n.timesheetApprove}</Link>
                </Menu.Item>
            </Menu>
        );
        const content = (
            <div className="dropDown-menu">
                <div className="dropDown-menu-item" onClick={() => this.popoverVisible()}><Link
                    rel="noopener noreferrer" to="/tuotuo/UserCenter">{mainI18n.userCenter}</Link></div>
                <div className="dropDown-menu-item" onClick={() => this.popoverVisible()}><Link
                    rel="noopener noreferrer" to="/tuotuo/AboutUs">{mainI18n.about}</Link></div>
                <div className="dropDown-menu-item" onClick={() => this.popoverVisible()}><a rel="noopener noreferrer"
                                                                                             onClick={clearToken}>{mainI18n.logout}</a>
                </div>
            </div>
        );

        return <div id="wrap" className={classnames({sliderShow: slider.isOpen})}>
            <div className="header clearfix">
                <nav>
                    <a className="logo" style={{backgroundImage: `url(/image/logo.png)`}}/>
                    <NavLink activeClassName="active" to="/tuotuo/main"><span>{mainI18n.home}</span></NavLink>
                    <NavLink activeClassName="active" to="/tuotuo/myTeams"><span>{mainI18n.team}</span></NavLink>
                    <NavLink activeClassName="active" to="/tuotuo/myProjects"><span>{mainI18n.project}</span></NavLink>
                </nav>
                <div className="user-hand">
                    <Dropdown overlay={menu}>
                        <a className="Menubtn btn-Timesheet tran" onClick={() => this.setTimeSheetVisible()}>
                            <i className="iconfont icon-calendar"/>
                            <span>TimeSheet</span>
                        </a>
                    </Dropdown>
                    <Link
                        rel="noopener noreferrer" to="/tuotuo/UserCenter"><Avatar size="large"
                                                                                  src={`${apihost}/user/GetUserAvatar?selectUserMail=${user.mail}&t=${user.avatarTimestamp}`}
                                                                                  className="userHeadImg"/></Link>
                    <Popover
                        content={content}
                        trigger="click"
                        visible={this.state.popoverVisible}
                        onVisibleChange={this.handleVisibleChange}>
                        <a className="userMsg">
                            <span className="userName">{user.userName}</span>
                            <i className="iconfont icon-arrow-down"/>
                        </a>
                    </Popover>
                </div>
                <span className="lang" onClick={() => changeLang()}>{`${user.lang == 'en' ? 'zh' : 'en'}`}</span>
            </div>
            <div className={classnames({rightSlider: true, open: slider.isOpen})}>
                {slider.sliderContent != 'div' && React.createElement(slider.sliderContent, {history})}
            </div>
            <Switch key={history.location.key}>
                <Route exact path={`${match.url}/main`} render={props => <Fade {...props }><Main /></Fade>}/>
                <Route exact path={`${match.url}/myTeams`} render={props => <Fade {...props }><MyTeams /></Fade>}/>
                <Route exact path={`${match.url}/myProjects`}
                       render={props => <Fade {...props }><MyProjects /></Fade>}/>
                <Route exact path={`${match.url}/projectdetail/:id`}
                       render={props => <Fade {...props }><ProjectDetail /></Fade>}/>
                <Route exact path={`${match.url}/addproject`}
                       render={props => <Fade {...props}><AddProject /></Fade>}/>
                <Route exact path={`${match.url}/teamDetail/:id`}
                       render={props => <Fade {...props}><TeamDetail /></Fade>}/>
                <Route exact path={`${match.url}/addteam`} render={props => <Fade {...props}><AddTeam /></Fade>}/>
                <Route exact path={`${match.url}/backlog/:id`}
                       render={props => <Fade {...props}><BackLogList /></Fade>}/>
                <Route exact path={`${match.url}/whiteboard/:id`}
                       render={props => <Fade {...props}><WhiteBoardList /></Fade>}/>
                <Route exact path={`${match.url}/timesheetapprove`}
                       render={props => <Fade  {...props}><TimeSheetApprove/></Fade>}/>
                <Route exact path={`${match.url}/timesheetreport`}
                       render={props => <Fade {...props}><TimeSheetReport /></Fade>}/>
                <Route exact path={`${match.url}/aboutUs`}
                       render={props => <Fade {...props}><AboutUs /></Fade>}/>
                <Route exact path={`${match.url}/UserCenter`}
                       render={props => <Fade {...props}><UserCenter /></Fade>}/>
                <Route render={() => <Redirect to="/404"/>}/>
            </Switch>
            {this.state.timeSheetVisible ?
                <TimeSheetSubmit key={this.state.newKey} visible={this.state.timeSheetVisible}
                                 onCancel={() => this.setTimeSheetVisible()}/> : null}
        </div>
    }
}


export default Container;