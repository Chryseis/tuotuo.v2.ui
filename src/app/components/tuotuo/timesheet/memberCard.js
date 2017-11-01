/**
 * Created by WillWang on 2017/7/18.
 */
import {Row, Col, Avatar, Icon, Input} from 'antd';
import ReactIScroll  from 'react-iscroll';
import iScroll from 'iscroll';
import moment from 'moment';
import {apihost} from '../../../constants/apiConfig';

class TimeSheetMemberCard extends React.Component {
    state = {
        approvalResult: 1,
        approvalComment: ''
    };

    handleCheck() {
        const {approveTimeSheet}= this.props;
        new Promise(resolve => resolve(approveTimeSheet(this.state.approvalResult, this.state.approvalComment, +moment()))).then(res => {
            if (res) {

            }
        })
    }

    handleChange(e) {
        this.setState({approvalComment: e.target.value.trim()});
    }

    render() {
        const {item,i18n} = this.props;
        const userInfo = item.info;
        const tasks = item.tasks;
        const submitTime = userInfo.submitTime ? moment(userInfo.submitTime).format('MM-DD HH:MM') : '';
        const subTime = userInfo.timeSheetTimeStamp ? moment(userInfo.timeSheetTimeStamp).format('MM/DD') : '';
        let totalHour = 0;
        const userInfoStatus = userInfo.status;
        tasks && tasks.length > 0 && _.forEach(tasks, (task) => {
            return totalHour += task.time
        });
        let strEmoji = "/image/smile.png";
        switch (userInfo.approveResult || this.state.approvalResult) {
            case 0:
                strEmoji = '/image/doubt.png';
                break;
            case 1:
                strEmoji = '/image/smile.png';
                break;
            case 2:
                strEmoji = '/image/happy.png';
                break;
        }
        return (
            <div className="ts-approve-card">
                <Row className="card-head">
                    <Col className="left" span={14}><Avatar className="avatar" size="large"
                                                            src={`${apihost}/user/GetUserAvatar?selectUserMail=${userInfo.userMail}`}/>
                        <div className="card-summary">
                            <div className="name">{userInfo.userName}</div>
                            <div
                                className="time">{userInfoStatus != 0 ? `${i18n.submitTime}：${submitTime}` : i18n.uncommit}</div>
                        </div>
                    </Col>
                    <Col className="right" span={10}>
                        <span className="date">{subTime}</span>
                        {userInfoStatus != 0 ? <span className="hours">{totalHour}h</span> : ''}

                    </Col>
                    <div className={classnames({
                        'left-stick': true,
                        blue: userInfoStatus != 0,
                        red: userInfoStatus == 0
                    })}></div>
                </Row>
                {userInfoStatus != 0 ?
                    <div>
                        <Row className="card-body">
                            <ReactIScroll iScroll={iScroll}
                                          options={{
                                              mouseWheel: true,
                                              scrollbars: 'custom',
                                              interactiveScrollbars: true,
                                              disablePointer: true
                                          }}
                            >
                                <div className="card-task-wrapper">
                                    {tasks && tasks.length > 0 && _.map(tasks, (task, i) => {
                                        return <Row className="card-task-item" key={i}>
                                            <Col className="card-task-summary" span={20}>
                                                <div className="info">{task.detail}</div>
                                                <div className="project"><Icon type="folder"/>{task.projectName}</div>
                                            </Col>
                                            <Col className="card-task-hour" span={4}>{task.time}h</Col>
                                        </Row>
                                    })}
                                </div>
                            </ReactIScroll>
                        </Row>
                        {userInfoStatus == 2 ?
                            <Row className="card-foot">
                                <Col span={3} className="emoji"><img src={strEmoji} alt=""/></Col>
                                <Col span={18} className="remark text"><span>{userInfo.approvalComment}</span></Col>
                                <Col span={3} className="check-icon"><Avatar size="large"
                                                                             src={`${apihost}/user/GetUserAvatar?selectUserMail=${userInfo.approvalUserMail}`}/></Col>
                            </Row> :
                            <Row className="card-foot">
                                <Col span={3} className="emoji">
                                    <img src={strEmoji} alt=""/>
                                    <ul>
                                        <li onClick={() => {
                                            this.setState({approvalResult: 0})
                                        }}><img src="/image/doubt.png" alt=""/><span className="tab">疑惑</span></li>
                                        <li onClick={() => {
                                            this.setState({approvalResult: 1})
                                        }}><img src="/image/smile.png" alt=""/><span className="tab">OK</span></li>
                                        <li onClick={() => {
                                            this.setState({approvalResult: 2})
                                        }}><img src="/image/happy.png" alt=""/><span className="tab">给力</span></li>
                                    </ul>
                                </Col>
                                <Col span={18} className="remark"><Input placeholder="备注内容"
                                                                         onChange={(e) => this.handleChange(e)}/></Col>
                                <Col span={3} className="check-icon"><Icon type="check-circle"
                                                                           onClick={() => this.handleCheck()}/></Col>
                            </Row>
                        }
                    </div> :
                    <Row className="card-occupied">
                        <img src="/image/ts-approve-occupied.png" alt=""/>
                    </Row>
                }
            </div>
        )
    }
}

export default TimeSheetMemberCard;