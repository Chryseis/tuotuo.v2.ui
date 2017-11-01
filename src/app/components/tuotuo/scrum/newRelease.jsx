/**
 * Created by AllenFeng on 2017/6/23.
 */
import {Modal, Popover, Button, Form, Input, Dropdown, Menu, Icon, message, Row, Col} from 'antd';
import ReactIScroll  from 'react-iscroll';
import iScroll from 'iscroll';
import {connect} from 'react-redux';
import {
    createRelease,
    changeRelease,
    createSprint,
    deleteSprint,
    getReleaseAndSprintList,
    deleteRelease
} from '../../../actions/Scrum';
import NewSprint from './newSprint';
import moment from 'moment';
import {resCode} from '../../../constants/common'
import Message from '../common/message';
import scrum_i18n from '../../../i18n/scrum_i18n'

const FormItem = Form.Item;
@connect(state => {
    return {
        user: state.user,
        scrum: state.scrum
    }
}, dispatch => {
    return {
        createRelease: (accessToken, refreshToken, teamID, releaseName, releaseSummary) => dispatch(createRelease(accessToken, refreshToken, teamID, releaseName, releaseSummary)),
        changeRelease: (releaseID) => dispatch(changeRelease(releaseID)),
        createSprint: (accessToken, refreshToken, teamID, releaseID, startTime, endTime) => dispatch(createSprint(accessToken, refreshToken, teamID, releaseID, startTime, endTime)),
        deleteSprint: (accessToken, refreshToken, teamID, sprintID, releaseID) => dispatch(deleteSprint(accessToken, refreshToken, teamID, sprintID, releaseID)),
        getReleaseAndSprintList: (accessToken, refreshToken, teamID) => dispatch(getReleaseAndSprintList(accessToken, refreshToken, teamID)),
        deleteRelease: (accessToken, refreshToken, teamID, releaseID) => dispatch(deleteRelease(accessToken, refreshToken, teamID, releaseID))
    }
})
class NewRelease extends React.Component {
    state = {
        visible: false,
        newSprintVisible: false,
        deleteVisible: false
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    content = () => {
        const {createRelease, user, teamID}=this.props;
        const scrumI18n = scrum_i18n[user.lang];
        const {getFieldDecorator}=this.props.form;
        const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    createRelease(user.access_token, user.refresh_token, teamID, values.releaseName, values.releaseSummary);
                    this.setState({visible: false}, () => {
                        this.props.form.resetFields();
                    })
                }
            });
        };
        return <Form onSubmit={handleSubmit}>
            <div className="add-release-cont">
                <FormItem>
                    {
                        getFieldDecorator('releaseName', {
                            rules: [{required: true, message: '请输入1~50字的Release名字!', min: 1, max: 50}]
                        })(<Input type="text" placeholder={scrumI18n.releaseName}/>)
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('releaseSummary', {})(<Input type="textarea"
                                                                       placeholder={scrumI18n.releaseSummary}/>)
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">{scrumI18n.save}</Button>
                </FormItem>
            </div>
        </Form>
    };

    getActiveReleaseAndSprint(releases) {
        let activeRelease = _.find(releases, (release) => {
            return release.releaseInfo.active === true
        });
        return activeRelease;
    }

    setSprintVisible(newSprintVisible) {
        this.setState({newSprintVisible})
    }

    deleteSprint = (sprintID, releaseID) => {
        const {deleteSprint, user, teamID, getReleaseAndSprintList}=this.props;
        new Promise(resolve => resolve(deleteSprint(user.access_token, user.refresh_token, teamID, sprintID, releaseID))).then(res => {
            if (res) {
                getReleaseAndSprintList(user.access_token, user.refresh_token, teamID)
            }
        })
    };

    handleDeleteVisibleChange = (flag, e) => {
        this.setState({deleteVisible: flag})
    };

    menu = (releaseID,scrumI18n) => {
        const {deleteRelease, user, teamID, getReleaseAndSprintList}=this.props;
        return <Menu>
            <Menu.Item>
                <a onClick={(e) => {
                    e.stopPropagation();
                    new Promise(resolve => resolve(deleteRelease(user.access_token, user.refresh_token, teamID, releaseID))).then(res => {
                        if (res.msg.code == resCode.LogicError) {
                            Message.error(res.msg.message)
                        } else {
                            getReleaseAndSprintList(user.access_token, user.refresh_token, teamID)
                        }
                    })
                }}><Icon type="delete"/>{scrumI18n.delete}</a>
            </Menu.Item>
        </Menu>
    };

    render() {
        const {visible, onCancel, changeRelease, createSprint, user, teamID, deleteSprint, getReleaseAndSprintList}=this.props;
        const scrumI18n = scrum_i18n[user.lang];
        const {releaseAndSprintList}=this.props.scrum;
        const activeReleaseAndSprint = this.getActiveReleaseAndSprint(releaseAndSprintList);
        return <Modal wrapClassName="vertical-center-modal" closable={false} visible={visible} footer={null}
                      width={680}>
            <div className="Popups">
                <a className="cancel iconfont icon-close" onClick={onCancel}/>
                <div className="p-cont p-backlog clearfix">
                    <p className="p-title">{scrumI18n.managerIteration}</p>
                    {releaseAndSprintList && releaseAndSprintList.length > 0 ?
                        <div className="p-backlog-release clearfix">
                            <div className="p-List  release-List">
                                <ReactIScroll iScroll={iScroll} options={{
                                    mouseWheel: true,
                                    scrollbars: 'custom',
                                    interactiveScrollbars: true,
                                    disablePointer: true
                                }} onScrollStart={() => {

                                }}
                                              onRefresh={(iScrollInstance) => {
                                                  let hasVerticalScroll = iScrollInstance.y;
                                                  if (this.state.canVerticallyScroll != hasVerticalScroll) {
                                                      this.setState({canVerticallyScroll: hasVerticalScroll})
                                                  }
                                              }}>
                                    <ul className="panel-group">
                                        {releaseAndSprintList && releaseAndSprintList.length > 0 && releaseAndSprintList.map((release, i) => {
                                            return <li key={i} className={classnames({
                                                'panel': true,
                                                'tran': true,
                                                'active': release.releaseInfo.active
                                            })} onClick={() => {
                                                changeRelease(release.releaseInfo.ID);
                                                this.setSprintVisible(false)
                                            }} title={release.releaseInfo.releaseName}>
                                                {release.releaseInfo.releaseName}
                                            </li>
                                        })}
                                    </ul>
                                </ReactIScroll>
                            </div>
                            <div className="release-detail">
                                <div className="hd">
                                    <div className="hd-cont">
                                        <div className="titleName"
                                             title={activeReleaseAndSprint && activeReleaseAndSprint.releaseInfo.releaseName}>{activeReleaseAndSprint && activeReleaseAndSprint.releaseInfo.releaseName}</div>
                                        <div className="title"
                                             title={activeReleaseAndSprint && activeReleaseAndSprint.releaseInfo.releaseSummary}>{activeReleaseAndSprint && activeReleaseAndSprint.releaseInfo.releaseSummary}</div>
                                    </div>
                                    <Dropdown overlay={this.menu(activeReleaseAndSprint.releaseInfo.ID,scrumI18n)}
                                              onClick={(e) => {
                                                  e.stopPropagation()
                                              }} onVisibleChange={this.handleDeleteVisibleChange}
                                              visible={this.state.deleteVisible}
                                              trigger={['click', 'hover']}>
                                        <a className="more iconfont icon-more"/>
                                    </Dropdown>
                                </div>
                                <div className="sprint">
                                    <ul className="sprint-list">
                                        {
                                            activeReleaseAndSprint.sprintInfoList && activeReleaseAndSprint.sprintInfoList.length > 0 && activeReleaseAndSprint.sprintInfoList.map((item, i) => {
                                                if (i == activeReleaseAndSprint.sprintInfoList.length - 1) {
                                                    return <li key={i}>
                                                        <span className="sprint-v">{`sprint${item.no}`}</span>
                                                        <span
                                                            className="sprint-date">{moment(item.startTimestamp).format('YYYY/MM/DD') + '-' + moment(item.endTimestamp).format('YYYY/MM/DD')}</span>
                                                        <span className="sprint-tool"><i
                                                            className="iconfont icon-del del"
                                                            onClick={this.deleteSprint.bind(this, item.ID, activeReleaseAndSprint.releaseInfo.ID)}/></span>
                                                    </li>
                                                }
                                                return <li key={i}>
                                                    <span className="sprint-v">{`sprint${item.no}`}</span>
                                                    <span
                                                        className="sprint-date">{moment(item.startTimestamp).format('YYYY/MM/DD') + '-' + moment(item.endTimestamp).format('YYYY/MM/DD')}</span>
                                                </li>
                                            })
                                        }
                                        {this.state.newSprintVisible && <NewSprint
                                            no={activeReleaseAndSprint.sprintInfoList && activeReleaseAndSprint.sprintInfoList.length > 0 ? activeReleaseAndSprint.sprintInfoList[activeReleaseAndSprint.sprintInfoList.length - 1].no + 1 : 1}
                                            onCancel={this.setSprintVisible.bind(this, false)}
                                            createSprint={createSprint.bind(null, user.access_token, user.refresh_token, teamID, activeReleaseAndSprint.releaseInfo.ID)}
                                            getReleaseAndSprintList={getReleaseAndSprintList.bind(null, user.access_token, user.refresh_token, teamID)}
                                        />}
                                    </ul>
                                </div>
                                <p className="sprint-List-ft">
                                    <a className="add-sprint-btn" onClick={(e) => {
                                        e.preventDefault();
                                        this.setSprintVisible(true)
                                    }}>{scrumI18n.addSprint}</a>
                                </p>
                            </div>
                        </div> : <div className="p-backlog-noRelease">
                            <img className="writeSprint" src="/image/writeSprint.png"/>
                            <p>{scrumI18n.addMileStone}</p>
                            <img className="arrows" src="/image/arrows.png"/>
                        </div>}
                </div>
                <div className="add-release">
                    <Popover
                        key={1}
                        content={this.content()}
                        trigger="click"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <Button className="add-release-btn" type="primary">+</Button>
                    </Popover>
                </div>
            </div>
        </Modal>
    }
}

export default Form.create()(NewRelease);