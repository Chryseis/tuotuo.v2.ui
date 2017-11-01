/**
 * Created by AllenFeng on 2017/7/5.
 */

import {connect} from 'react-redux';
import {Row, Col, Icon, DatePicker, Collapse} from 'antd';
import moment from 'moment';
import {Link} from 'react-router-dom';
import TimeSheetSearchBar from'./timeSheetCheckBar';
import TimeSheetMemberCard from './memberCard';
import {queryCheckTimeSheetList, approveTimeSheet} from '../../../actions/TimeSheet';
import timesheet_i18n from '../../../i18n/timesheet_i18n'

const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;
@connect(state => {
    return {
        user: state.user,
        timeSheet: state.timeSheet
    }
}, dispatch => {
    return {
        queryCheckTimeSheetList: (accessToken, refreshToken, startTime, endTime, selectTeamIDList, selectUserIDList, selectStatusList, from, to) => dispatch(queryCheckTimeSheetList(accessToken, refreshToken, startTime, endTime, selectTeamIDList, selectUserIDList, selectStatusList, from, to)),
        approveTimeSheet: (accessToken, refreshToken, user, sheetID, result, comment, viewTimeStamp) => dispatch(approveTimeSheet(accessToken, refreshToken, user, sheetID, result, comment, viewTimeStamp))
    }
})

class TimeSheetApprove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: +moment().day(1),
            endTime: +moment().day(7)
        }
    }

    componentDidMount() {
        const {user, queryCheckTimeSheetList}=this.props;
        queryCheckTimeSheetList(user.access_token, user.refresh_token, +moment().day(1), +moment().day(7))
    }

    render() {
        const {user, timeSheet, approveTimeSheet, queryCheckTimeSheetList} = this.props;
        const timesheetI18n = timesheet_i18n[user.lang];
        return <div className="ts-approve-wrapper">
            <Row className="ts-approve-title">
                <Col className="icon"><i className="iconfont icon-calendar"/>{timesheetI18n.approve}</Col>
            </Row>
            <Collapse className="ts-check clearfix" defaultActiveKey={['1']}>
                <Panel className="clearfix" header={<span className="filter-container"><Icon type="filter"/></span>}
                       key="1">
                    <TimeSheetSearchBar accessToken={user.access_token}
                                        query={(startTime, endTime, selectTeamIDList, selectUserIDList, selectStatusList) => queryCheckTimeSheetList(user.access_token, user.refresh_token, startTime, endTime, selectTeamIDList, selectUserIDList, selectStatusList)} i18n={timesheetI18n}/>
                </Panel>
            </Collapse>
            <Row className="ts-approve-crad-wrapper" gutter={20}>
                {timeSheet.timeSheetCheckList && _.map(timeSheet.timeSheetCheckList, (item, i) => {
                    return <Col span={8} key={i}>
                        <TimeSheetMemberCard
                            item={item}
                            approveTimeSheet={(result, comment, viewTimeStamp) => approveTimeSheet(user.access_token, user.refresh_token, user, item.info.ID, result, comment, viewTimeStamp)}
                            i18n={timesheetI18n}
                        />
                    </Col>
                })}
            </Row>
            <Link className="back iconfont icon-back tran" to="/tuotuo/main"></Link>
        </div>
    }
}

export default TimeSheetApprove;