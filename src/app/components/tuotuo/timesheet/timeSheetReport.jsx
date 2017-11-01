/**
 * Created by AllenFeng on 2017/7/3.
 */
import {connect} from 'react-redux';
import {Modal, Row, Col, Avatar, Icon, Input, Select, InputNumber, Button, Popover, DatePicker} from 'antd';
import {Link} from 'react-router-dom';
import TimeSheetSearchBar from'./timeSheetSearchBar';
import TimeSheetChartItem from './timeSheetChartItem'
import {queryReportTimeSheetList} from '../../../actions/TimeSheet';
import moment from 'moment';
import {apihost} from '../../../constants/apiConfig'
import BackToMain from '../common/backToMain';
import {TransitionGroup, CSSTransition, Transition} from 'react-transition-group'
import timesheet_i18n from '../../../i18n/timesheet_i18n'


const RangePicker = DatePicker.RangePicker;
@connect(state => {
    return {
        user: state.user,
        timeSheet: state.timeSheet
    }
}, dispatch => {
    return {
        queryReportTimeSheetList: (accessToken, refreshToken, startTime, endTime, selectTeamIDList, selectUserIDList, selectProjectIDList, from, to) => dispatch(queryReportTimeSheetList(accessToken, refreshToken, startTime, endTime, selectTeamIDList, selectUserIDList, selectProjectIDList, from, to))
    }
})
class TimeSheetReport extends React.Component {

    state = {
        fold: true
    }

    changeView = (fold) => {
        this.setState({
            fold
        })
    }

    componentDidMount() {
        const {user, queryReportTimeSheetList}=this.props
        queryReportTimeSheetList(user.access_token, user.refresh_token, +moment(), +moment().add(6, 'days'))
    }

    render() {
        const {user, timeSheet, queryReportTimeSheetList, history, i18n}=this.props
        const timesheetI18n = timesheet_i18n[user.lang];
        return <div className="ts-report-wrapper">
            <Row className="ts-report-title">
                <Col span={12} className="icon"><i className="iconfont icon-chart"/><span>{timesheetI18n.report}</span></Col>
                <Col span={12} className="export"><Button type="primary" size="large"
                                                          icon="download">{timesheetI18n.exportReport}</Button></Col>
            </Row>
            <TimeSheetSearchBar accessToken={user.access_token}
                                query={queryReportTimeSheetList.bind(null, user.access_token, user.refresh_token)}
                                i18n={timesheetI18n}/>
            <Row className="ts-report-total" gutter={20}>
                <Col span={8}>
                    <div className="total-item blue">
                        <Row className="item-wrapper">
                            <Col className="left" span={8}>
                                <div className="icon-wrapper">
                                    <i className="iconfont icon-users"/>
                                    <div><span>{timesheetI18n.teamNum}</span></div>
                                </div>
                            </Col>
                            <Col className="right" span={16}><span
                                className="num">{timeSheet.timesheetReportList.teamMemberCount}</span></Col>
                        </Row>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="total-item green">
                        <Row className="item-wrapper">
                            <Col className="left" span={8}>
                                <div className="icon-wrapper">
                                    <i className="iconfont icon-folder"/>
                                    <div><span>{timesheetI18n.projectNum}</span></div>
                                </div>
                            </Col>
                            <Col className="right" span={16}><span
                                className="num">{timeSheet.timesheetReportList.projectCount}</span></Col>
                        </Row>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="total-item purple">
                        <Row className="item-wrapper">
                            <Col className="left" span={8}>
                                <div className="icon-wrapper">
                                    <i className="iconfont icon-time"/>
                                    <div><span>{timesheetI18n.workTime}</span></div>
                                </div>
                            </Col>
                            <Col className="right" span={16}><span
                                className="num">{timeSheet.timesheetReportList.totalTime}</span></Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row className="ts-tool-bar">
                <Col span={12} className="name"><span>{timesheetI18n.memberData}</span></Col>
                <Col span={12} className="tool"><span
                    className={classnames({'tool-wrapper': true, 'active': this.state.fold})}
                    onClick={this.changeView.bind(this, true)}><Icon type="bars"/></span><span
                    className={classnames({'tool-wrapper': true, 'active': !this.state.fold})}
                    onClick={this.changeView.bind(this, false)}><Icon type="appstore-o"/></span></Col>
            </Row>
            <Row className="ts-report-members-wrapper" gutter={20}>
                <Transition in={this.state.fold} timeout={150}>
                    {(status) => (<div className={`fade ${status}`}>
                        {_.map(timeSheet.timesheetReportList.userInfos, (userInfo, i) => {
                            if (this.state.fold) {
                                return <Col className="ts-report-item chart" span={8}
                                            key={i}>
                                    <Row className="member">
                                        <Col className="left" span={16}><Avatar size="large"
                                                                                src={`${apihost}/user/GetUserAvatar?selectUserMail=${userInfo.userName}`}/><span
                                            className="name">{userInfo.userName}</span></Col>
                                        <Col className="right" span={8}><Icon
                                            type="clock-circle-o"/><span>{_.sum(_.map(userInfo.timeSheetTimeInfos, (timesheet) => timesheet.totalTime))}</span></Col>
                                    </Row>
                                </Col>
                            }
                        }) }</div>)}
                </Transition>
                <Transition in={!this.state.fold} timeout={150}>
                    {(status) => (<div className={`fade ${status}`}>
                        {_.map(timeSheet.timesheetReportList.userInfos, (userInfo, i) => {
                            if (!this.state.fold) {
                                return <TimeSheetChartItem key={i} userInfo={userInfo}/>
                            }
                        }) }</div>)}
                </Transition>
            </Row>
            <BackToMain history={history}/>
        </div>
    }
}

export default TimeSheetReport;