/**
 * Created by AllenFeng on 2017/6/15.
 */
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
    getBacklogList,
    getReleaseAndSprintList,
    moveBacklog,
    deleteBacklog,
    changeSprint,
    selectCurrentSprint,
    resetCurrentBacklogList
} from '../../../actions/Scrum';
import NewBackLog from './newBackLog';
import moment from 'moment';
import BackLogTarget from './backLogContainer';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReleaseDropDown from './releaseDropdown';
import NewRelease from './newRelease';
import BackToMain from '../common/backToMain';
import {Row, Col} from 'antd';
import authorization from '../decorators/authorization'
import scrum_i18n from '../../../i18n/scrum_i18n'

@authorization
@connect(state => {
    return {
        user: state.user,
        scrum: state.scrum
    }
}, dispatch => {
    return {
        getBacklogList: (accessToken, refreshToken, teamID, sprintID, isCurrent) => dispatch(getBacklogList(accessToken, refreshToken, teamID, sprintID, isCurrent)),
        getReleaseAndSprintList: (accessToken, refreshToken, teamID) => dispatch(getReleaseAndSprintList(accessToken, refreshToken, teamID)),
        moveBacklog: (accessToken, refreshToken, teamID, sprintID, backlog) => dispatch(moveBacklog(accessToken, refreshToken, teamID, sprintID, backlog)),
        deleteBacklog: (accessToken, refreshToken, teamID, sourceType, backlogID) => dispatch(deleteBacklog(accessToken, refreshToken, teamID, sourceType, backlogID)),
        changeSprint: (accessToken, refreshToken, teamID, sprint) => dispatch(changeSprint(accessToken, refreshToken, teamID, sprint)),
        selectCurrentSprint: (accessToken, refreshToken, teamID, sprintID) => dispatch(selectCurrentSprint(accessToken, refreshToken, teamID, sprintID)),
        resetCurrentBacklogList: () => dispatch(resetCurrentBacklogList())
    }
})
@DragDropContext(HTML5Backend)
class BackLogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newBackLogVisible: false,
            type: 'add',
            modalKey: 0,
            backlog: {},
            dropDownVisible: false,
            newReleaseVisible: false
        }
    }

    componentDidMount() {
        const {getBacklogList, getReleaseAndSprintList, user, match, scrum, resetCurrentBacklogList} = this.props;
        getBacklogList(user.access_token, user.refresh_token, match.params.id, 0);
        new Promise(resolve => resolve(getReleaseAndSprintList(user.access_token, user.refresh_token, match.params.id))).then(res => {
            if (res) {
                let currentSprintId = this.getCurrentSprintId(res.msg.data);
                if (currentSprintId != 0) {
                    getBacklogList(user.access_token, user.refresh_token, match.params.id, currentSprintId, true);
                } else {
                    resetCurrentBacklogList();
                }
            }
        });

        document.addEventListener('click', this.closeDropdown)
    }

    closeDropdown = (e) => {
        let node = e.target;
        if (this.dropdown && !this.dropdown.contains(node)) {
            this.setState({dropDownVisible: false})
        }
    }

    setBackLogModaVisible(newBackLogVisible, type, backlog = {}) {
        if (newBackLogVisible) {
            this.setState({
                newBackLogVisible,
                type,
                backlog
            })
        } else {
            this.setState({
                newBackLogVisible,
                type,
                modalKey: this.state.modalKey + 1
            })
        }
    }

    setReleaseModalVisible(newReleaseVisible) {
        this.setState({newReleaseVisible})
    }

    getCurrentSprintId(array) {
        let sourceArray = _.cloneDeep(array);
        let currentID = 0;
        _.forEach(sourceArray, (release) => {
            _.forEach(release.sprintInfoList, (sprint) => {
                if (sprint.state === 1) {
                    currentID = sprint.ID;
                    return;
                }
            })
        })
        return currentID;
    }

    setDropdownVisible(e) {
        e.stopPropagation();
        this.setState({dropDownVisible: !this.state.dropDownVisible})
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const {match, moveBacklog, user, deleteBacklog, changeSprint, selectCurrentSprint, history}=this.props;
        const {backlogList, currentBacklogList, currentSprint, releaseAndSprintList} = this.props.scrum;
        const scrumI18n = scrum_i18n[user.lang];
        return <Row className="backlog page-cont clearfix" type="flex" justify="space-around">
            <Col span={11} id="dropProduct" className="backlog-list backlog-add">
                <div className="inner">
                    <div className="hd clearfix">
                        <div className="hdTitle">{scrumI18n.backlog}</div>
                        <span className="proNum">{backlogList ? backlogList.length : 0}</span>
                        <a className="addPro iconfont icon-plus"
                           onClick={() => this.setBackLogModaVisible(true, 'add')}>
                        </a>
                    </div>
                    <BackLogTarget backlogList={backlogList} type="backlog" sourceType="backlog"
                                   targetType="currentBackLog"
                                   onDrop={moveBacklog.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                   moveSprintID="0" currentSprint={currentSprint}
                                   editBacklog={this.setBackLogModaVisible.bind(this, true, 'edit')}
                                   deleteBacklog={deleteBacklog.bind(null, user.access_token, user.refresh_token, match.params.id, 'backlog')}
                    />
                </div>
            </Col>
            <Col span={11} id="dropSprint" className="backlog-list backlog-save">
                <div className="inner">
                    <div className="hd clearfix">
                        <div className="hdTitle">{scrumI18n.viewIteration}</div>
                        {currentSprint ? <div className={classnames({
                                'sprintSel': true,
                                'tran': true,
                                'active': this.state.dropDownVisible
                            })} ref={(dropdown) => this.dropdown = dropdown}
                                              onClick={this.setDropdownVisible.bind(this)}>
                                <span className="sprint-v"
                                      title={`${currentSprint.releaseName}-sprint${currentSprint.no}`}>{`${currentSprint.releaseName}-sprint${currentSprint.no}`}</span>
                                <span
                                    className="sprint-date">{moment(currentSprint.startTimestamp).format('YYYY/MM/DD') + '-' + moment(currentSprint.endTimestamp).format('YYYY/MM/DD')}</span>
                                <i className={classnames({
                                    'iconfont': true,
                                    'icon-arrow-down': true,
                                    'arrow-up': this.state.dropDownVisible
                                })}/>
                                {this.state.dropDownVisible && <ReleaseDropDown release={releaseAndSprintList}
                                                                                changeSprint={changeSprint.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                                                                selectCurrentSprint={selectCurrentSprint.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                                                                newRelease={this.setReleaseModalVisible.bind(this, true)}
                                />}
                            </div> :
                            <button className="btn add-sprint" onClick={this.setReleaseModalVisible.bind(this, true)}>
                                {scrumI18n.newIteration}</button>}
                    </div>
                    <BackLogTarget backlogList={currentBacklogList} type="currentBackLog" sourceType="currentBackLog"
                                   targetType="backlog"
                                   onDrop={moveBacklog.bind(null, user.access_token, user.refresh_token, match.params.id)}
                                   moveSprintID={currentSprint && currentSprint.ID}
                                   editBacklog={this.setBackLogModaVisible.bind(this, true, 'edit')}
                                   deleteBacklog={deleteBacklog.bind(null, user.access_token, user.refresh_token, match.params.id, 'currentBackLog')}
                    />
                </div>
            </Col>
            <BackToMain history={history}/>
            <NewBackLog key={this.state.modalKey} visible={this.state.newBackLogVisible}
                        onCancel={this.setBackLogModaVisible.bind(this, false)} teamID={match.params.id}
                        type={this.state.type} backlog={this.state.backlog}/>
            <NewRelease visible={this.state.newReleaseVisible} teamID={match.params.id}
                        onCancel={this.setReleaseModalVisible.bind(this, false)}/>
        </Row>
    }
}

export default BackLogList;