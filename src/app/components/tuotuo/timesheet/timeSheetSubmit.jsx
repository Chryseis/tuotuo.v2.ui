/**
 * Created by AllenFeng on 2017/7/3.
 */
import {Modal, Row, Col, Avatar, Icon, Input, Select, Button, Popover, DatePicker, message} from 'antd';
import ReactIScroll  from 'react-iscroll';
import iScroll from 'iscroll';
import moment from 'moment';
import {connect} from 'react-redux';
import {
    getMyTimeSheet,
    createTimeSheetTasks,
    submitTimeSheet,
    approveTimeSheet,
    deleteTimeSheetTask,
    modifyTimeSheetTask,
    changeTaskType,
    getMyCompleteTaskList,
    selectImportTask,
    resetSelectImportTask
} from '../../../actions/TimeSheet';
import {getMyProjects} from '../../../actions/Projects';
import TimeSheetTask from './timeSheetTask';
import ImportTask from './importTaskList';
import {apihost} from "../../../constants/apiConfig";
import Message from '../common/message';
import timesheet_i18n from '../../../i18n/timesheet_i18n';
import gb from 'antd/lib/date-picker/locale/en_GB.js'




@connect(state => {
    return {
        user: state.user,
        timeSheet: state.timeSheet,
        projects: state.projects
    }
}, dispatch => {
    return {
        getMyProjects: (accessToken, refreshToken) => dispatch(getMyProjects(accessToken, refreshToken)),
        getMyTimeSheet: (accessToken, refreshToken, currentTimeStamp) => dispatch(getMyTimeSheet(accessToken, refreshToken, currentTimeStamp)),
        createTimeSheetTasks: (accessToken, refreshToken, sheetID, tasks) => dispatch(createTimeSheetTasks(accessToken, refreshToken, sheetID, tasks)),
        submitTimeSheet: (accessToken, refreshToken, sheetID) => dispatch(submitTimeSheet(accessToken, refreshToken, sheetID)),
        approveTimeSheet: (accessToken, refreshToken, sheetID) => dispatch(approveTimeSheet(accessToken, refreshToken, sheetID)),
        deleteTimeSheetTask: (accessToken, refreshToken, taskID) => dispatch(deleteTimeSheetTask(accessToken, refreshToken, taskID)),
        modifyTimeSheetTask: (accessToken, refreshToken, taskID, detail, selectProjectID, time) => dispatch(modifyTimeSheetTask(accessToken, refreshToken, taskID, detail, selectProjectID, time)),
        changeTaskType: (taskList) => dispatch(changeTaskType(taskList)),
        getMyCompleteTaskList: (accessToken, refreshToken, currentTimeStamp) => dispatch(getMyCompleteTaskList(accessToken, refreshToken, currentTimeStamp)),
        selectImportTask: (taskID) => dispatch(selectImportTask(taskID)),
        resetSelectImportTask: () => dispatch(resetSelectImportTask())
    }
})

class TimeSheetSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: +moment().format('x'),
            newTaskVisible: false,
            popoverVisible: false,
            isSub: true
        }
    }

    setTaskVisible(newTaskVisible) {
        const {projects} = this.props;
        let proNum = projects ? projects.projects.length : '';
        if (proNum == 0) {
            Message.warning("您的项目为空");
        }
        this.setState({newTaskVisible});
    }

    handleSub(isSub) {
        this.setState({isSub});
    }

    timeSheetSub() {
        const {submitTimeSheet, user, timeSheet, onCancel}=this.props;
        new Promise(resolve => resolve(submitTimeSheet(user.access_token, user.refresh_token, timeSheet.timeSheet.ID))).then(res => {
            if (res) {
                onCancel();
            }
        })

    }

    componentDidMount() {
        const {user, getMyProjects, getMyTimeSheet, getMyCompleteTaskList} = this.props;
        getMyProjects(user.access_token, user.refresh_token);
        getMyTimeSheet(user.access_token, user.refresh_token, this.state.date);
        getMyCompleteTaskList(user.access_token, user.refresh_token, this.state.date);
    }

    changeType(index) {
        const {timeSheet, changeTaskType} = this.props;
        const timeSheetTasks = timeSheet.timeSheetTasks;
        timeSheetTasks[index].type ? (timeSheetTasks[index].type = !timeSheetTasks[index].type) : timeSheetTasks[index].type = true;
        changeTaskType(timeSheetTasks);
    }


    selectImportTask(taskID) {
        const {selectImportTask} = this.props;
        selectImportTask(taskID);
    }

    popoverVisible = () => {
        this.setState({
            popoverVisible: false
        });
    };
    handleVisibleChange = (popoverVisible) => {
        this.setState({popoverVisible});
    };

    content = () => {
        const {user, timeSheet, createTimeSheetTasks, resetSelectImportTask} = this.props;
        const timesheetI18n = timesheet_i18n[user.lang];
        return <ImportTask
            myCompleteTaskList={timeSheet.myCompleteTaskList}
            selectImportTask={(taskID) => this.selectImportTask(taskID)}
            createTimeSheetTasks={(tasks) => createTimeSheetTasks(user.access_token, user.refresh_token, timeSheet.timeSheet.ID, tasks)}
            resetSelectImportTask={resetSelectImportTask}
            popoverVisible={this.popoverVisible}
            i18n={timesheetI18n}
        />
    };

    render() {
        const Option = Select.Option;
        const {user, visible, onCancel, timeSheet, projects, getMyTimeSheet, createTimeSheetTasks, deleteTimeSheetTask, modifyTimeSheetTask, submitTimeSheet} = this.props;
        const projectList = projects.projects;
        const timesheetI18n = timesheet_i18n[user.lang];
        let totalHour = 0;
        timeSheet.timeSheetTasks && timeSheet.timeSheetTasks.length > 0 && _.forEach(timeSheet.timeSheetTasks, (item) => {
            return totalHour += item.time
        });
        return <Modal wrapClassName="vertical-center-modal" closable={false} visible={visible} footer={null}
                      width={780}>
            <div className="ts-wrapper">
                <Row className="ts-title">
                    <Col span={8} className="avatar"><Avatar size="large"
                                                             src={`${apihost}/user/GetUserAvatar?selectUserMail=${user.mail}`}/></Col>
                    <Col span={8} className="time">
                        <span>{moment(this.state.date).format('YYYY-MM-DD')}</span>
                        <Icon type="down" className="down"/>
                        <DatePicker style={{position: 'absolute', width: '100%', left: 24, top: 7, opacity: 0.01}}
                                    defaultValue={moment(this.state.date)}
                                    locale={gb}
                                    format={'YYYY-MM-DD'} onChange={(date) => {
                            this.setState({
                                date: +date
                            });
                            getMyTimeSheet(user.access_token, user.refresh_token, +date);

                        }}/>
                    </Col>
                    <Col span={8} className="close"><Icon type="close" onClick={onCancel}/></Col>
                </Row>
                <Row className="ts-tb-header">
                    <Col span={12} className="left">{timesheetI18n.workContent}</Col>
                    <Col span={8} className="middle">{timesheetI18n.project}</Col>
                    <Col span={4} className="right">{timeSheet.time}(<span>{totalHour}h</span>)</Col>
                </Row>
                <div className="ts-task-wrapper">
                    <ReactIScroll iScroll={iScroll}
                                  options={{
                                      mouseWheel: true,
                                      scrollbars: 'custom',
                                      interactiveScrollbars: true,
                                      disablePointer: true
                                  }}
                                  onRefresh={(iScrollInstance) => {
                                      let hasVerticalScroll = iScrollInstance.y;
                                      if (this.state.canVerticallyScroll != hasVerticalScroll) {
                                          this.setState({canVerticallyScroll: hasVerticalScroll})
                                      }
                                  }}>
                        <div>
                            {/*已有task*/}
                            {timeSheet.timeSheetTasks && timeSheet.timeSheetTasks.length > 0 && timeSheet.timeSheetTasks.map((item, i) => {
                                return (
                                    <TimeSheetTask
                                        key={i}
                                        projectList={projectList}
                                        item={item}
                                        status={timeSheet.timeSheet.status}
                                        changeType={timeSheet.timeSheet.status != 2 ? () => this.changeType(i) : ''}
                                        handleSub={this.handleSub.bind(this)}
                                        getMyTimeSheet={getMyTimeSheet.bind(null, user.access_token, user.refresh_token)}
                                        deleteTimeSheetTask={() => deleteTimeSheetTask(user.access_token, user.refresh_token, item.ID)}
                                        modifyTimeSheetTask={(detail, projectID, time) => modifyTimeSheetTask(user.access_token, user.refresh_token, item.ID, detail, projectID, time)}
                                        i18n={timesheetI18n}
                                    />
                                )
                            })}

                            {/*新增task*/}
                            {projectList && projectList.length > 0 && this.state.newTaskVisible && <TimeSheetTask
                                projectList={projectList}
                                createTimeSheetTasks={createTimeSheetTasks.bind(null, user.access_token, user.refresh_token, timeSheet.timeSheet.ID)}
                                getMyTimeSheet={getMyTimeSheet.bind(null, user.access_token, user.refresh_token)}
                                handleSub={this.handleSub.bind(this)}
                                onCancel={() => this.setTaskVisible(false)}
                                i18n={timesheetI18n}
                            />}
                            {
                                timeSheet.timeSheet && timeSheet.timeSheet.status != 2 ? <Row className="ts-add">
                                        <Col span={24} onClick={() => {
                                            this.handleSub(false);
                                            this.setTaskVisible(true)
                                        }}>
                                            <span className="add">+</span><span>{timesheetI18n.add}</span>
                                        </Col>
                                    </Row> : ''
                            }
                        </div>
                    </ReactIScroll>
                </div>
                {  timeSheet.timeSheet && (timeSheet.timeSheet.status == 2 ? <Row className="ts-foot view">
                        <Col span={2} className="left">
                            {timeSheet.timeSheet.approvalResult == 0 ?
                                <img src="/image/doubt.png" alt=""/> : timeSheet.timeSheet.approvalResult == 1 ?
                                    <img src="/image/smile.png" alt=""/> : timeSheet.timeSheet.approvalResult == 2 ?
                                        <img src="/image/happy.png" alt=""/> : ''
                            }
                        </Col>
                        <Col span={14}
                             className="comment"><span >{timeSheet.timeSheet ? timeSheet.timeSheet.approvalComment : ''}</span></Col>
                        <Col span={8} className="right avatar"><Avatar size="large"
                                                                       src={`${apihost}/user/GetUserAvatar?selectUserMail=${timeSheet.timeSheet.approvalUserMail}`}/></Col>
                    </Row> :
                    <Row className="ts-foot">
                        <Col span={8} className="left">
                            <Popover
                                overlayClassName="ts-pop"
                                content={::this.content()}
                                visible={this.state.popoverVisible}
                                onVisibleChange={this.handleVisibleChange}
                                trigger="click"
                            >
                                <Button type="primary" className="btn export">{timesheetI18n.importWhiteboard}</Button>
                            </Popover>
                        </Col>
                        <Col span={16} className="right">
                            <Button className="btn cancel" onClick={(e) => {
                                e.preventDefault();
                                onCancel();
                            }}>{timesheetI18n.cancel}</Button>
                            <Button className="btn save" onClick={() => {
                                this.state.isSub && this.timeSheetSub()
                            }}>{timesheetI18n.save}</Button>
                        </Col>
                    </Row>)
                }
            </div>
        </Modal>
    }
}

export default TimeSheetSubmit;