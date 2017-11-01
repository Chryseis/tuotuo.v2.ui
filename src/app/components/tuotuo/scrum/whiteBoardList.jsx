/**
 * Created by AllenFeng on 2017/6/27.
 */
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Tooltip} from 'antd';
import {
    getWhiteboardList,
    getCurrentReleaseAndSprint,
    addTask,
    editTask,
    deleteTask,
    editTaskState,
    getTaskLogList,
    initWhiteBoard
} from '../../../actions/Scrum';
import {getTeamDetail} from '../../../actions/Teams';
import {memberList} from '../../../actions/Teams'
import NewTask from './newTask';
import TaskContainer from'./taskContainer';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BackToMain from '../common/backToMain';
import {apihost}  from '../../../constants/apiConfig';
import scrum_i18n from '../../../i18n/scrum_i18n'

@connect(state => {
    return {
        user: state.user,
        teams: state.teams,
        scrum: state.scrum
    }
}, dispatch => {
    return {
        getTeamDetail: (accessToken, refreshToken, teamId) => dispatch(getTeamDetail(accessToken, refreshToken, teamId)),
        getWhiteboardList: (accessToken, refreshToken, teamID, sprintID) => dispatch(getWhiteboardList(accessToken, refreshToken, teamID, sprintID)),
        getCurrentReleaseAndSprint: (accessToken, refreshToken, teamID) => dispatch(getCurrentReleaseAndSprint(accessToken, refreshToken, teamID)),
        memberList: (accessToken, refreshToken, teamID) => dispatch(memberList(accessToken, refreshToken, teamID)),
        addTask: (accessToken, refreshToken, teamID, projectID, backLogID, title, content, assignedEmail, time, state) => dispatch(addTask(accessToken, refreshToken, teamID, projectID, backLogID, title, content, assignedEmail, time, state)),
        editTask: (accessToken, refreshToken, teamID, projectID, taskID, title, content, assignedEmail, time, state) => dispatch(editTask(accessToken, refreshToken, teamID, projectID, taskID, title, content, assignedEmail, time, state)),
        deleteTask: (accessToken, refreshToken, teamID, projectID, taskID) => dispatch(deleteTask(accessToken, refreshToken, teamID, projectID, taskID)),
        editTaskState: (accessToken, refreshToken, teamID, taskID, state) => dispatch(editTaskState(accessToken, refreshToken, teamID, taskID, state)),
        getTaskLogList: (accessToken, refreshToken, teamID, taskID) => dispatch(getTaskLogList(accessToken, refreshToken, teamID, taskID)),
        initWhiteBoard: () => dispatch(initWhiteBoard())
    }
})
@DragDropContext(HTML5Backend)
class WhiteBoardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newTaskVisible: false,
            modalKey: 0,
            sprint: {},
            type: 'add',
            task: null
        }
    }

    componentDidMount() {
        const {getCurrentReleaseAndSprint, getWhiteboardList, user, match, memberList, getTeamDetail} =this.props;
        new Promise(resolve => resolve(getCurrentReleaseAndSprint(user.access_token, user.refresh_token, match.params.id))).then(res => {
            if (res && res.msg.data) {
                getWhiteboardList(user.access_token, user.refresh_token, match.params.id, res.msg.data.sprintID);
            }
        });
        memberList(user.access_token, user.refresh_token, match.params.id);
        getTeamDetail(user.access_token, user.refresh_token, match.params.id);
    }

    setTaskModalVisible = (newTaskVisible, sprint, type, task = {}) => {
        if (newTaskVisible) {
            this.setState({
                newTaskVisible,
                sprint,
                task,
                type
            })
        } else {
            this.setState({
                newTaskVisible,
                modalKey: this.state.modalKey + 1
            })
        }
    };

    componentWillUnmount() {
        const {initWhiteBoard} =this.props;
        initWhiteBoard();
    }

    render() {
        const {teams, addTask, editTask, deleteTask, editTaskState, getTaskLogList, user, match, history} =this.props;
        const {memberList}=this.props.teams;
        const {whiteBoardList, currentSprint, taskLogList}=this.props.scrum;
        const scrumI18n = scrum_i18n[user.lang];
        let tasks = [];
        whiteBoardList && whiteBoardList.length > 0 && whiteBoardList.forEach((item) => {
            tasks.push(...item.tasks)
        });
        return <div className="whiteBoard page-cont">
            <div className="wb-hd">
                <ol className="breadcrumb">
                    <li>
                        <a className="back-homepage" onClick={(e) => {
                            e.preventDefault();
                            history.push('/tuotuo/main')
                        }}><i className="iconfont icon-users"/>{teams.team && teams.team.info.teamName}</a>
                    </li>
                    <li>&gt;</li>
                    <li>
                        {currentSprint && `${currentSprint.releaseName}-sprint${currentSprint.sprintNo}`}
                    </li>
                </ol>
            </div>
            <div className="box form-white">
                {whiteBoardList && whiteBoardList.length > 0 ? <table className="whiteboard-table">
                        <thead>
                        <tr className="taskboard-row">
                            <th className="taskboard-cell taskboard-parent">{scrumI18n.backlog}</th>
                            <th className="taskboard-cell">{scrumI18n.plan} <i>{_.filter(tasks, {state: 1}).length}</i>
                            </th>
                            <th className="taskboard-cell">{scrumI18n.inProgress}
                                <i>{_.filter(tasks, {state: 2}).length}</i></th>
                            <th className="taskboard-cell">{scrumI18n.finish}
                                <i>{_.filter(tasks, {state: 3}).length}</i></th>
                        </tr>
                        </thead>
                        <tbody>
                        {whiteBoardList.map((whiteBoard, i) => {
                            return <tr className="taskboard-row" key={i}>
                                <td className="taskboard-cell taskboard-parent">
                                    <div className="tb-pivot-item">
                                        <span className="wit-title">{whiteBoard.info.title}</span>
                                        <div className="assign">
                                            <Tooltip title={whiteBoard.info.assignUserName}>
                                                <img className="userImg"
                                                     src={`${apihost}/user/GetUserAvatar?selectUserMail=${whiteBoard.info.assignUserMail}`}/>
                                            </Tooltip>
                                            <div className="workName"><i
                                                className="iconfont icon-folder"/><span>{whiteBoard.info.projectName}</span>
                                            </div>
                                        </div>
                                        <Tooltip title="Add Task">
                                            <a
                                                className="add-icon iconfont icon-plus"
                                                onClick={() => this.setTaskModalVisible(true, whiteBoard.info, 'add')}/>
                                        </Tooltip>

                                    </div>
                                </td>
                                <TaskContainer tasks={whiteBoard.tasks} state={1}
                                               editTask={this.setTaskModalVisible.bind(this, true, whiteBoard.info, 'edit')}
                                               targetType={[`inProgram${i}`, `done${i}`]}
                                               sourceType={`toDo${i}`}
                                               onDrop={editTaskState.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                               scrumI18n={scrumI18n}
                                               index={i}
                                />
                                <TaskContainer tasks={whiteBoard.tasks} state={2}
                                               editTask={this.setTaskModalVisible.bind(this, true, whiteBoard.info, 'edit')}
                                               targetType={[`toDo${i}`, `done${i}`]}
                                               sourceType={`inProgram${i}`}
                                               onDrop={editTaskState.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                               scrumI18n={scrumI18n}
                                               index={i}
                                />
                                <TaskContainer tasks={whiteBoard.tasks} state={3}
                                               editTask={this.setTaskModalVisible.bind(this, true, whiteBoard.info, 'edit')}
                                               targetType={[`toDo${i}`, `inProgram${i}`]}
                                               sourceType={`done${i}`}
                                               onDrop={editTaskState.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                               scrumI18n={scrumI18n}
                                               index={i}
                                />
                            </tr>
                        })}
                        </tbody>
                    </table> : <div className="whiteboard-add">
                        <img src="/image/add-backlog.png"/>
                        <p>sprint里还没有添加产品backlog</p>
                        <Link className="btn link" to={`/tuotuo/backlog/${match.params.id}`}>前往添加</Link>
                    </div>}
            </div>
            <BackToMain history={history}/>
            <NewTask key={this.state.modalKey} visible={this.state.newTaskVisible}
                     onCancel={this.setTaskModalVisible.bind(this, false)} sprint={this.state.sprint}
                     members={memberList} type={this.state.type} task={this.state.task}
                     addTask={addTask.bind(null, user.access_token, user.refresh_token, match.params.id)}
                     editTask={editTask.bind(null, user.access_token, user.refresh_token, match.params.id)}
                     deleteTask={deleteTask.bind(null, user.access_token, user.refresh_token, match.params.id)}
                     getTaskLogList={getTaskLogList.bind(null, user.access_token, user.refresh_token, match.params.id)}
                     taskLogList={taskLogList}
                     scrumI18n={scrumI18n}
            />
        </div>
    }
}

export default WhiteBoardList;