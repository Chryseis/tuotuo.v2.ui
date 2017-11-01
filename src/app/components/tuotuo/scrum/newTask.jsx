/**
 * Created by AllenFeng on 2017/6/28.
 */
import {Modal, Row, Col, Timeline, Select, TreeSelect, Input, Form, InputNumber, Dropdown, Menu, Icon} from 'antd';
import ReactQuill from 'react-quill';
import ReactIScroll  from 'react-iscroll';
import iScroll from 'iscroll';
import {taskState} from '../../../constants/common';
import moment from 'moment';
import {apihost}  from '../../../constants/apiConfig';
import scrum_i18n from '../../../i18n/scrum_i18n'


const {Option, OptGroup} = Select;
const FormItem = Form.Item;
class NewTask extends React.Component {
    constructor(props) {
        super(props);
        const {members, task, sprint}=this.props;
        this.state = {
            taskTitle: (props.task && props.task.title) || '',
            time: (props.task && props.task.time) || '1',
            member: sprint.assignUserMail,
            state: (props.task && props.task.state) || '1',
            editorHtml: (props.task && props.task.content) || '',
            visible: false
        }
    }

    componentDidMount() {
        const {task, getTaskLogList, type}=this.props;
        type != 'add' && getTaskLogList(task.taskID);
    }

    handleEditorChange = (html) => {
        this.setState({editorHtml: html});
    }

    menu = () => {
        const {deleteTask, onCancel, task}=this.props;
        return <Menu>
            <Menu.Item>
                <a className="back-delete" onClick={(e) => {
                    e.stopPropagation();
                    new Promise(resolve => resolve(deleteTask(task.taskID))).then(res => {
                        if (res) {
                            onCancel();
                        }
                    })
                }}><Icon type="delete"/>删除</a>
            </Menu.Item>
        </Menu>
    }

    componentWillReceiveProps(nextProps) {
        const {task, getTaskLogList, type, sprint}=nextProps;
        if ((!_.isEqual(this.props.sprint.ID, nextProps.sprint.ID) && type == 'add') || (!_.isEqual(this.props.task, nextProps.task) && type !== 'add')) {
            this.setState({
                taskTitle: nextProps.task.title || '',
                time: nextProps.task.time || '1',
                member: nextProps.task.assignedEmail || sprint.assignUserMail,
                state: nextProps.task.state || '1',
                editorHtml: nextProps.task.content || ''
            });
            type != 'add' && getTaskLogList(task.taskID);
        }
    }

    handleSubmit = (e) => {
        const {addTask, editTask, sprint, task, onCancel, type} =this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (type == 'add') {
                    new Promise(resolve => resolve(addTask(sprint.projectID, sprint.ID, values.taskTitle, this.state.editorHtml, this.state.member, this.state.time, this.state.state))).then(res => {
                        if (res) {
                            onCancel();
                        }
                    })
                } else {
                    new Promise(resolve => resolve(editTask(sprint.projectID, task.taskID, values.taskTitle, this.state.editorHtml, this.state.member, this.state.time, this.state.state))).then(res => {
                        if (res) {
                            onCancel();
                        }
                    })
                }
            }
        });
    }

    handleVisibleChange = (flag, e) => {
        this.setState({visible: flag});
    }

    render() {
        const {visible, onCancel, sprint, members, type, task, taskLogList, scrumI18n}=this.props;
        const {getFieldDecorator} = this.props.form;
        return <Modal wrapClassName="vertical-center-modal" closable={false} visible={visible} footer={null} width="72%"
                      style={{maxWidth: 1180, minWidth: 830}}>
            <div className="task clearfix">
                <Form onSubmit={::this.handleSubmit}>
                    <div className="task-cont">
                        <div className="tc-hd">
                            <span>{scrumI18n.whiteBoardTask}</span>
                            <a className="close iconfont icon-close" onClick={onCancel}/>
                            {type != 'add' && <Dropdown overlay={this.menu()} onClick={(e) => {
                                e.stopPropagation()
                            }} onVisibleChange={this.handleVisibleChange} visible={this.state.visible}
                                                        trigger={['click']}>
                                <a href="javascript:;" className="more iconfont icon-more-2-copy"></a></Dropdown>}
                        </div>
                        <div className="taskHead clearfix">
                            <FormItem>
                                <Row className="form-group-item" type="flex" justify="space-between">
                                    <Col span={20} className="taskName">
                                        <Row>
                                            {type !== 'add' &&
                                            <Col span={3}> <span className="tn-tag">{`#${task.taskID}`}</span></Col>}
                                            <Col span={type != 'add' ? 21 : 24}>
                                                {
                                                    getFieldDecorator('taskTitle', {
                                                        rules: [{
                                                            required: true,
                                                            message: scrumI18n.verify,
                                                            min: 1,
                                                            max: 50
                                                        }],
                                                        initialValue: this.state.taskTitle
                                                    })(<Input className="tn-name"
                                                              placeholder={scrumI18n.taskTitle}/>)
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={3}>
                                        <InputNumber className="esTime" type="tel" min={1} max={100000}
                                                     defaultValue={this.state.time} placeholder={scrumI18n.hour}
                                                     onChange={(value) => {
                                                         this.setState({time: value})
                                                     }}/>
                                    </Col>
                                </Row>
                            </FormItem>
                        </div>
                        <div className="task-write form-group edui-container">
                            <ReactQuill
                                style={{height: 320}}
                                theme={'snow'}
                                onChange={::this.handleEditorChange}
                                value={this.state.editorHtml}
                                modules={NewTask.modules}
                                formats={NewTask.formats}
                            />
                        </div>
                        <div className="form-group TaskSelect">
                            <Row className="form-group-item" type="flex" justify="space-between">
                                <Col span={12}>
                                    <p className="title">{scrumI18n.relatingProject}</p>
                                    <Input className="formPro" size="large" disabled={true}
                                           defaultValue={sprint && sprint.projectName}/>
                                </Col >
                                <Col span={5}>
                                    <p className="title">{scrumI18n.performer}</p>
                                    {members && members.length > 0 && <Select size="large"
                                                                              defaultValue={this.state.member}
                                                                              placeholder="请选择" style={{width: '100%'}}
                                                                              onChange={(value) => {
                                                                                  this.setState({
                                                                                      member: value
                                                                                  })
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
                                <Col span={5}>
                                    <p className="title">{scrumI18n.status}</p>
                                    <Select size="large" placeholder="请选择" defaultValue={this.state.state.toString()}
                                            style={{width: '100%'}} onChange={(value) => {
                                        this.setState({
                                            state: value
                                        })
                                    }}>
                                        <Option value="1">{scrumI18n.new}</Option>
                                        <Option value="2">{scrumI18n.inProgress}</Option>
                                        <Option value="3">{scrumI18n.done}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <button className="btn btnSave btnColor3">{scrumI18n.save}</button>
                        <button className="btn btnCancel " onClick={(e) => {
                            e.preventDefault();
                            onCancel()
                        }}>{scrumI18n.cancel}
                        </button>
                    </div>
                </Form>
                <div className="task-cont-right" style={{height: 730}}>

                    <ReactIScroll iScroll={iScroll} options={{
                        mouseWheel: true,
                        scrollbars: 'custom',
                        interactiveScrollbars: true,
                        disablePointer: true
                    }}
                    >
                        <div>
                            <p className="taskTitle"><span>{`#${sprint && sprint.ID}`}</span>|
                                <span>{sprint && sprint.title}</span></p>
                            <div className="form-group"
                                 dangerouslySetInnerHTML={{__html: sprint && sprint.content}}></div>
                            <div className="form-group">
                                <p className="title">{scrumI18n.standard}:</p>
                                <div>{sprint && sprint.standard}</div>
                            </div>
                            <div className="form-group">
                                <div className="item">
                                    <span className="title">{scrumI18n.relatingProject}</span>
                                    <span>{sprint && sprint.projectName}</span>
                                </div>
                                <div className="item">
                                    <span className="title">{scrumI18n.principal}</span>
                                    <div className="userMsg">
                                        <img
                                            src={`${apihost}/user/GetUserAvatar?selectUserMail=${sprint.assignUserMail}`}
                                            height="300" width="326"/>
                                        <span>{sprint && sprint.assignUserName}</span>
                                    </div>
                                </div>
                                <div className="item">
                                    <span className="title">{scrumI18n.priority}</span>
                                    <span>{sprint && sprint.level}</span>
                                </div>
                            </div>
                            <div className="form-group tasklog-container">
                                <div className="timeCount">
                                    {type != 'add' && taskLogList.length > 0 && <Timeline>
                                        {_.map(taskLogList, (taskLog, i) => {
                                            return <Timeline.Item key={i}>
                                                <Row className="timeLine">
                                                    <Col span={15} className="tl-lt">
                                                        <img
                                                            src={`${apihost}/user/GetUserAvatar?selectUserMail=${taskLog.assignedEmail}`}
                                                            alt=""/>
                                                        <div className="tl-lt-ct">
                                                            <p>{taskLog.assignedName || 'jerry'}</p>
                                                            <span>{moment(taskLog.createTimestamp || +new Date()).format('YYYY/MM/DD HH:mm')}</span>
                                                        </div>
                                                    </Col>
                                                    <Col span={9} className="tl-rt">{taskState[taskLog.state]}</Col>
                                                </Row>
                                            </Timeline.Item>
                                        })}
                                    </Timeline>}
                                </div>
                            </div>
                        </div>
                    </ReactIScroll>
                </div>
            </div>
        </Modal>
    }
}

NewTask.modules = {
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
NewTask.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
]

export default Form.create()(NewTask);