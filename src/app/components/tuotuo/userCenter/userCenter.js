import {connect} from 'react-redux';
import {Row, Col, Icon, Tabs, Card} from 'antd';
import {Link} from 'react-router-dom';
import OtherAccount from './otherAccount';
import UserInfo from './userInfo';
import UserInfoWrapper from './userInfoWrapper';
import ResetPassword from './resetPassword';
import {qqConfig} from '../../../constants/thirdPartyConfig'
import {
    updatePassword,
    updateUser,
    getBindThirdPartyAccountList,
    unbindUser,
    thirdLoginInner
} from '../../../actions/User'
import {getQueryString} from '../../../utils/uriUtil';
import userCenter_i18n from '../../../i18n/userCenter_i18n'

@connect(state => {
    return {
        user: state.user,
        timeSheet: state.timeSheet
    }
}, dispatch => {
    return {
        updatePassword: (accessToken, refreshToken, mail, oldPassword, newPassword) => dispatch(updatePassword(accessToken, refreshToken, mail, oldPassword, newPassword)),
        updateUser: (accessToken, refreshToken, userName, avatarToken, mobile) => dispatch(updateUser(accessToken, refreshToken, userName, avatarToken, mobile)),
        getBindThirdPartyAccountList: (accessToken, refreshToken) => dispatch(getBindThirdPartyAccountList(accessToken, refreshToken)),
        unbindUser: (accessToken, refreshToken, thirdPartyType) => dispatch(unbindUser(accessToken, refreshToken, thirdPartyType)),
        thirdLoginInner: (accessToken, refreshToken, code, redirectUri, agent) => dispatch(thirdLoginInner(accessToken, refreshToken, code, redirectUri, agent))
    }
})

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "1"
        }
    }

    componentDidMount() {
        const {user, thirdLoginInner, history, location}=this.props;
        let agent = getQueryString('agent');
        let code = getQueryString('code');
        if (code) {
            thirdLoginInner(user.access_token, user.refresh_token, code, qqConfig.inner_redirect_uri, agent);
            history.push('/tuotuo/UserCenter', {activeKey: '3'})
        }
        if (location.state) {
            this.setState({
                activeKey: location.state.activeKey
            })
        }
    }

    callback(activeKey) {
        this.setState({
            activeKey
        })
    }

    render() {
        const TabPane = Tabs.TabPane;
        const {user, updatePassword, updateUser, getBindThirdPartyAccountList, history, unbindUser} = this.props;
        const userCenterI18n = userCenter_i18n[user.lang];
        return (
            <div className="page-cont offset-1 userCenter">
                <Tabs
                    activeKey={this.state.activeKey}
                    tabPosition="left"
                    onChange={::this.callback}
                    className="user-center"
                >
                    <TabPane tab={userCenterI18n.personInfo} key="1">
                        <UserInfoWrapper user={user} updateUser={updateUser} i18n={userCenterI18n}/>
                    </TabPane>
                    <TabPane tab={userCenterI18n.account} key="2">
                        <ResetPassword user={user} updatePassword={updatePassword} i18n={userCenterI18n}/>
                    </TabPane>
                    <TabPane tab={userCenterI18n.thirdAcc} key="3">
                        <OtherAccount user={user} getBindThirdPartyAccountList={getBindThirdPartyAccountList}
                                      unbindUser={unbindUser} history={history} i18n={userCenterI18n}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default UserCenter;