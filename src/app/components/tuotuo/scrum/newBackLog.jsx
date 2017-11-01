/**
 * Created by AllenFeng on 2017/6/16.
 */
import {connect} from 'react-redux';
import {Select, Row, Col, Modal, Form, Input, InputNumber, Button} from 'antd';
import ReactQuill from 'react-quill';
import {memberList} from '../../../actions/Teams';
import {getMemberProjects} from '../../../actions/Projects'
import {addBackLog, editBackLog} from '../../../actions/Scrum';
import {apihost} from '../../../constants/apiConfig'
import scrum_i18n from '../../../i18n/scrum_i18n'

const {Option, OptGroup} = Select;
const FormItem = Form.Item;
@connect(state => {
    return {
        user: state.user,
        teams: state.teams,
        projects: state.projects
    }
}, dispatch => {
    return {
        getMemberList: (accessToken, refreshToken, teamID) => dispatch(memberList(accessToken, refreshToken, teamID)),
        getMemberProjects: (accessToken, refreshToken, mail) => dispatch(getMemberProjects(accessToken, refreshToken, mail)),
        addBackLog: (accessToken, refreshToken, teamID, title, content, standard, assignUserMail, selectProjectID, state, level) => dispatch(addBackLog(accessToken, refreshToken, teamID, title, content, standard, assignUserMail, selectProjectID, state, level)),
        editBackLog: (accessToken, refreshToken, teamID, backlogID, title, content, standard, assignUserMail, selectProjectID, state, level, sprintID) => dispatch(editBackLog(accessToken, refreshToken, teamID, backlogID, title, content, standard, assignUserMail, selectProjectID, state, level, sprintID))
    }
})
class NewBackLog extends React.Component {
    constructor(props) {
        super(props);
        let backlog = props.backlog;
        let members = props.teams.memberList;
        let projects = props.projects.memberProjects;
        this.state = {
            editorHtml: backlog.content || '',
            backlogTitle: backlog.title || '',
            priority: backlog.level || 1,
            standard: backlog.standard || '',
            member: backlog.assignUserMail || members && members.length > 0 && members[0].memberMail,
            project: backlog.projectID || projects && projects.length > 0 && projects[0].projectID,
            state: backlog.state || '1'
        };
    }

    componentDidMount() {
        const {getMemberList, getMemberProjects, user, teamID} = this.props;
        new Promise(resolve => resolve(getMemberList(user.access_token, user.refresh_token, teamID))).then(res => {
            if (res) {
                res.msg.data && res.msg.data.length > 0 && getMemberProjects(user.access_token, user.refresh_token, res.msg.data[0].memberMail)
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.backlog, nextProps.backlog)) {
            this.setDefault(nextProps);
        } else {
            let members = nextProps.teams.memberList;
            let projects = nextProps.projects.memberProjects;
            if (!this.state.member || !this.state.project) {
                this.setState({
                    member: members.length > 0 && members[0].memberMail,
                    project: projects && projects.length > 0 && projects[0].projectID
                })
            }
        }
        if (!_.isEqual(this.props.projects.memberProjects, nextProps.projects.memberProjects)) {
            this.setProject(nextProps);
        }
    }

    setProject(props) {
        let projects = props.projects.memberProjects;
        this.setState({
            project: projects && projects.length > 0 && projects[0].projectID,
        })
    }

    setDefault(props) {
        let backlog = props.backlog;
        let members = props.teams.memberList;
        let projects = props.projects.memberProjects;
        this.setState({
            editorHtml: backlog.content || '',
            backlogTitle: backlog.title || '',
            priority: backlog.level || 1,
            standard: backlog.standard || '',
            member: backlog.assignUserMail || members && members.length > 0 && members[0].memberMail,
            project: backlog.projectID || projects && projects.length > 0 && projects[0].projectID,
            state: backlog.state || '1'
        })
    }

    handleEditorChange = (html) => {
        this.setState({editorHtml: html});
    }

    handleSubmit = (e) => {
        const {user, teamID, addBackLog, editBackLog, onCancel, type, backlog} = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (type == 'add') {
                    new Promise(resolve => resolve(addBackLog(user.access_token, user.refresh_token, teamID, values.backlogTitle, this.state.editorHtml, this.state.standard, this.state.member, this.state.project, this.state.state, this.state.priority))).then(res => {
                        onCancel();
                    })
                } else {
                    new Promise(resolve => resolve(editBackLog(user.access_token, user.refresh_token, teamID, backlog.ID, values.backlogTitle, this.state.editorHtml, this.state.standard, this.state.member, this.state.project, this.state.state, this.state.priority, backlog.sprintID))).then(res => {
                        onCancel();
                    })
                }
            }
        });
    }

    filterArray = () => {
        const {backlog, teams, projects}=this.props;
        let members = _.cloneDeep(teams.memberList);
        let projectList = _.cloneDeep(projects.memberProjects);
        if (backlog.ID) {
            if (members && members.length > 0) {
                let member = _.find(members, (member) => {
                    return member.memberMail == backlog.assignUserMail
                })
                if (!member) {
                    members.push({
                        memberMail: backlog.assignUserMail,
                        memberName: backlog.assignUserName,
                        disable: true
                    })
                }
            }

            if (projectList && projectList.length > 0) {
                let project = _.find(projectList, (project) => {
                    return project.projectID == backlog.projectID
                })
                if (!project) {
                    projectList.push({projectID: backlog.projectID, projectName: backlog.projectName, disable: true})
                }
            }
        }
        return {
            members,
            projects: projectList
        }
    };

    render() {
        const {visible, onCancel, type, getMemberProjects, user, backlog} = this.props;
        const scrumI18n = scrum_i18n[user.lang];
        const {getFieldDecorator} = this.props.form;
        const {members, projects}=this.filterArray();
        return <Modal wrapClassName="vertical-center-modal" closable={false} visible={visible} footer={null} width='68%'
                      style={{minWidth: '580px', maxWidth: '830px'}}>
            <Form onSubmit={::this.handleSubmit}>
                <div className="task backlog-modal clearfix">
                    <div className="task-cont">
                        <div className="tc-hd">
                            <span>{scrumI18n.backlog}</span>
                            <a className="close iconfont icon-close" onClick={onCancel}/>
                        </div>
                        <div className="backlogHead clearfix">
                            <FormItem>
                                <Row className="form-group-item" type="flex" justify="space-between">
                                    <Col span={20} className="taskName">
                                        <Row>
                                            {type !== 'add' &&
                                            <Col span={3}> <span className="tn-tag">{`#${backlog.ID}`}</span></Col>}
                                            <Col span={type != 'add' ? 21 : 24}>
                                                {
                                                    getFieldDecorator('backlogTitle', {
                                                        rules: [{
                                                            required: true,
                                                            message: scrumI18n.verify,
                                                            min: 1,
                                                            max: 50
                                                        }],
                                                        initialValue: this.state.backlogTitle
                                                    })(
                                                        <Input
                                                            size="large" className="tn-name"
                                                            placeholder={scrumI18n.title}/>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={3}>
                                        <InputNumber className="esTime" type="tel" min={1} max={999}
                                                     defaultValue={this.state.priority} placeholder={scrumI18n.priority}
                                                     onChange={(value) => {
                                                         this.setState({priority: value})
                                                     }}/>
                                    </Col>
                                </Row>
                            </FormItem>

                        </div>
                        <div className="form-group edui-container">
                            <ReactQuill
                                style={{height: 223}}
                                theme={'snow'}
                                onChange={::this.handleEditorChange}
                                value={this.state.editorHtml}
                                modules={NewBackLog.modules}
                                formats={NewBackLog.formats}
                            />
                            <Input className="reviewStandard" type="textarea" placeholder={scrumI18n.standard}
                                   value={this.state.standard} onChange={(e) => {
                                this.setState({standard: e.target.value})
                            }}/>
                        </div>
                        <div className="form-group TaskSelect">
                            <Row className="form-group-item" type="flex" justify="space-between">
                                <Col span={5}>
                                    <p className="title">{scrumI18n.owner}</p>
                                    {members && members.length > 0 && <Select size="large"
                                                                              defaultValue={this.state.member}
                                                                              placeholder="请选择" style={{width: '100%'}}
                                                                              onChange={(value) => {
                                                                                  this.setState({member: value})
                                                                                  getMemberProjects(user.access_token, user.refresh_token, value)
                                                                              }}>
                                        {members && members.length > 0 && members.map((member, i) => {
                                            return <Option key={i} value={member.memberMail}
                                                           disabled={member.disable ? true : false}
                                                           title={member.memberMail}>
                                                <img className="ant-sel-middle ant-sel-circle"
                                                     src={`${apihost}/user/GetUserAvatar?selectUserMail=${member.memberMail}`}
                                                     alt=""/><span
                                                className="ant-sel-middle">{member.memberName || member.memberMail.split('@')[0]}</span>
                                            </Option>
                                        })}
                                    </Select>}
                                </Col >
                                <Col span={12}>
                                    <p className="title">{scrumI18n.relatingProject}</p>
                                    { projects && projects.length > 0 ?
                                        <Select size="large" value={this.state.project.toString()}
                                                placeholder="请选择"
                                                style={{width: '100%'}}
                                                onChange={(value) => {
                                                    this.setState({project: value})
                                                }}>
                                            {projects && projects.length > 0 && projects.map((project, i) => {
                                                return <Option key={i} value={project.projectID.toString()}
                                                               disabled={project.disable ? true : false}
                                                               title={project.projectName}>
                                                    <span className="ant-sel-middle">{project.projectName}</span>
                                                </Option>
                                            })}
                                        </Select> : <Select size="large" allowClear disabled value="">
                                            <Option value="">{scrumI18n.addProject}</Option>
                                        </Select>}
                                </Col >
                                <Col span={5}>
                                    <p className="title">{scrumI18n.status}</p>
                                    <Select size="large" defaultValue={this.state.state.toString()} placeholder="请选择"
                                            style={{width: '100%'}}
                                            onChange={(value) => {
                                                this.setState({state: value})
                                            }}>
                                        <Option value="1">
                                            <div className="ant-sel-middle ant-sel-circle2"
                                                 style={{backgroundColor: "#5899FC"}}></div>
                                            <span className="ant-sel-middle">{scrumI18n.new}</span>
                                        </Option>
                                        <Option value="2">
                                            <div className="ant-sel-middle ant-sel-circle2"
                                                 style={{backgroundColor: "#5899FC"}}></div>
                                            <span className="ant-sel-middle">{scrumI18n.inProgress}</span>
                                        </Option>
                                        <Option value="3">
                                            <div className="ant-sel-middle ant-sel-circle2"
                                                 style={{backgroundColor: "#33c9ba"}}></div>
                                            <span className="ant-sel-middle">{scrumI18n.complete}</span>
                                        </Option>
                                        <Option value="5">
                                            <div className="ant-sel-middle ant-sel-circle2"
                                                 style={{backgroundColor: "#FD8A5C"}}></div>
                                            <span className="ant-sel-middle">{scrumI18n.failed}</span>
                                        </Option>
                                    </Select>
                                </Col >
                            </Row>
                        </div>
                        <Button type="primary" htmlType="submit" className="btn btnSave btnColor3"
                                disabled={(projects && projects.length > 0) ? '' : 'disabled'}>{scrumI18n.save}</Button>
                        <button className="btn btnCancel" onClick={(e) => {
                            e.preventDefault();
                            onCancel();
                        }}>{scrumI18n.cancel}
                        </button>
                    </div>
                </div>
            </Form>
        </Modal>
    }
}

NewBackLog.modules = {
    toolbar: [
        [{'header': [1, 2, false]}, {'font': []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'},
            {'indent': '-1'}, {'indent': '+1'}],
        ['link']
    ]
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
NewBackLog.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
]


export default Form.create()(NewBackLog);