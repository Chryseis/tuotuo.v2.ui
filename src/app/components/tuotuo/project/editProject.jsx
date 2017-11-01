/**
 * Created by AllenFeng on 2017/6/7.
 */
import {connect} from 'react-redux';
import {closeSlider} from '../../../actions/Slider';
import {Form, Input, Button, Upload, Modal} from 'antd';
import {getBase64, imgRequest} from '../../../utils/imgUtil';
import {apihost} from '../../../constants/apiConfig';
import {resCode} from '../../../constants/common';
import {editProject, deleteProject, transformProject} from '../../../actions/Projects';
import TurnOverMembers from '../common/turnOverMembers';
import project_i18n from '../../../i18n/project_i18n';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(state => {
    return {
        user: state.user,
        slider: state.slider,
        projects: state.projects
    }
}, dispatch => {
    return {
        closeSlider: () => dispatch(closeSlider()),
        editProject: (accessToken, refreshToken, projectID, projectName, projectSummary, avatarToken) => dispatch(editProject(accessToken, refreshToken, projectID, projectName, projectSummary, avatarToken)),
        deleteProject: (accessToken, refreshToken, projectID) => dispatch(deleteProject(accessToken, refreshToken, projectID)),
        transformProject: (accessToken, refreshToken, projectID, mail) => dispatch(transformProject(accessToken, refreshToken, projectID, mail))
    }
})
class EditProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            imageToken: '',
            turnOverMembersVisible: false
        };
        this.uploadAttr = {
            name: 'file',
            action: `${apihost}/attachment/UploadImage`,
            data: {
                width: 280,
                height: 168
            },
            showUploadList: false,
            headers: {'Authorization': `bearer ${props.user.access_token}`},
            beforeUpload: function () {

            },
            onChange: function (info) {
                if (info.file.status !== 'uploading') {

                }
                if (info.file.status === 'done') {
                    let imageToken = info.file.response.code == resCode.OK ? info.file.response.data[0].uploadToken : '';
                    getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl, imageToken}));
                } else if (info.file.status === 'error') {

                }
            }.bind(this)
        }

    }

    componentDidMount() {
        const {projectID, projectAvatar} =this.props.projects.project.info;
        projectAvatar != '' ? imgRequest('/project/ViewProjectAvatar', {
                projectID, avatar: projectAvatar
            }, (imageUrl) => {
                let img = new Image();
                img.onload = () => {
                    this.setState({imageUrl})
                };
                img.error = () => {

                };
                img.src = imageUrl

            }, this.props.user.access_token) : this.setState({
                imageUrl: ''
            })
    }

    componentWillReceiveProps(nextProps) {
        const {projectID, projectAvatar} =nextProps.projects.project.info;
        if (this.props.projects.project.info.projectID != projectID) {
            projectAvatar != '' ? imgRequest('/project/ViewProjectAvatar', {
                    projectID, avatar: projectAvatar
                }, (imageUrl) => {
                    let img = new Image();
                    img.onload = () => {
                        this.setState({imageUrl})
                    };
                    img.error = () => {

                    };
                    img.src = imageUrl

                }, this.props.user.access_token) : this.setState({
                    imageUrl: ''
                })
        }
    }

    setTurnOverMembersModaVisible(turnOverMembersVisible, e) {
        e && e.preventDefault();
        this.setState({
            turnOverMembersVisible
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {user, editProject, history, projects, closeSlider}=this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => resolve(editProject(user.access_token, user.refresh_token, projects.project.info.projectID, values.projectName, values.projectSummary, this.state.imageToken)))
                    .then(res => {
                        closeSlider();
                    })
            }
        });
    };

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    showConfirm() {
        const {deleteProject, projects, user, history}=this.props;
        confirm({
            title: '确定删除项目吗',
            content: '',
            onOk() {
                return new Promise(resolve => resolve(deleteProject(user.access_token, user.refresh_token, projects.project.info.projectID))).then(res => {
                    history.goBack();
                })
            },
            onCancel() {
            },
        });
    }

    render() {
        const {closeSlider, projects, editProject, deleteProject, user, transformProject}=this.props;
        const projectI18n = project_i18n[user.lang]
        let userMail = user.mail;
        let self = projects.project && _.find(projects.project.members, (member) => {
                return member.memberMail == userMail;
            });
        let isSetting = self && self.roleCode != "MEMBER" ? true : false;
        const {getFieldDecorator} = this.props.form;
        let owner = _.find(projects.project.members, (member) => {
            return member.roleCode == 'OWNER'
        });
        let manager = _.find(projects.project.members, (member) => {
            return member.roleCode == 'MANAGER'
        });
        let turnOverMembers = _.cloneDeep(projects.project.members);
        _.remove(turnOverMembers, (member) => {
            return member.memberMail == user.mail;
        });

        let bgImage = this.state.imageUrl ? this.state.imageUrl : '/image/login_bg.png';
        return <Form onSubmit={::this.handleSubmit}>
            <div>
                <div className="slider-hd">
                    <span>{projectI18n.projectInformationOpt}</span>
                    <i className="iconfont icon-close" onClick={closeSlider}/>
                </div>
                <div className="slider-bd">
                    <div>
                        <FormItem>
                            <p className="title">{projectI18n.projectName}</p>
                            {getFieldDecorator('projectName', {
                                rules: [{required: true, message: `${projectI18n.inputProjectName}!`}],
                                initialValue: projects.project && projects.project.info.projectName
                            })(
                                <Input placeholder={projectI18n.inputProjectName} disabled={!isSetting}/>
                            )}
                        </FormItem>
                    </div>
                    <div>
                        <FormItem>
                            <p className="title">{projectI18n.projectDes}</p>
                            {
                                getFieldDecorator('projectSummary', {
                                    rules: [{required: true, message: `${projectI18n.inputProjectDes}!`}],
                                    initialValue: projects.project && projects.project.info.projectSummary
                                })(<Input type="textarea" placeholder={projectI18n.inputProjectDes}
                                          disabled={!isSetting}/>)
                            }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem>
                            <p className="title">{projectI18n.cover}</p>
                            <div style={{'display': 'block', 'textAlign': 'center'}}>
                                {
                                    getFieldDecorator('upload', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile,
                                    })(<Upload  {...this.uploadAttr} disabled={!isSetting}>
                                        {
                                            <div className=" upImg bgStyle"
                                                 style={{backgroundImage: `url(${bgImage})`}}>
                                                {isSetting && <a className="upImg-icon"><i
                                                    className="iconfont icon-cloud-upload tran"/></a>}
                                            </div>
                                        }
                                    </Upload>)
                                }
                            </div>
                        </FormItem>
                    </div>
                    <div className="clearfix">
                        <p className="title">{projectI18n.owner}</p>
                        <div className="">
                            <div className="liLeft">
                                <img src={`${apihost}/user/GetUserAvatar?selectUserMail=${owner.memberMail}`} alt=""/>
                                <span>{owner.memberName || owner.memberMail.split('@')[0]}</span>
                            </div>
                            {owner.memberMail == user.mail && <div className="liRight">
                                <button className="btn tran"
                                        onClick={this.setTurnOverMembersModaVisible.bind(this, true)}>{projectI18n.move}
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="slider-ft">
                    {isSetting &&
                    <Button type="primary" htmlType="submit" className="btn tran btnColor3">{projectI18n.save}</Button>}
                    {owner.memberMail == user.mail &&
                    <a className="iconYellow" onClick={::this.showConfirm}>{projectI18n.removeProject}</a>}
                </div>
                <TurnOverMembers visible={this.state.turnOverMembersVisible}
                                 onCancel={this.setTurnOverMembersModaVisible.bind(this, false)}
                                 members={turnOverMembers}
                                 transform={transformProject.bind(null, user.access_token, user.refresh_token, projects.project.info.projectID)}/>
            </div>
        </Form>
    }
}

export default Form.create()(EditProject);