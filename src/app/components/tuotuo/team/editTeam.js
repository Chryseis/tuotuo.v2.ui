/**
 * Created by AllenFeng on 2017/6/7.
 */
import {connect} from 'react-redux';
import {closeSlider} from '../../../actions/Slider';
import {Form, Input, Button, Upload, Modal} from 'antd';
import {getBase64, imgRequest} from '../../../utils/imgUtil';
import {apihost} from '../../../constants/apiConfig';
import {resCode} from '../../../constants/common';
import {editTeam, deleteTeam, transformTeam} from '../../../actions/Teams';
import TurnOverMembers from '../common/turnOverMembers';
import team_i18n from '../../../i18n/team_i18n';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(state => {
    return {
        user: state.user,
        slider: state.slider,
        teams: state.teams
    }
}, dispatch => {
    return {
        closeSlider: () => dispatch(closeSlider()),
        editTeam: (accessToken, refreshToken, teamID, teamName, teamSummary, avatarToken) => dispatch(editTeam(accessToken, refreshToken, teamID, teamName, teamSummary, avatarToken)),
        deleteTeam: (accessToken, refreshToken, teamID) => dispatch(deleteTeam(accessToken, refreshToken, teamID)),
        transformTeam: (accessToken, refreshToken, teamID, mail) => dispatch(transformTeam(accessToken, refreshToken, teamID, mail))
    }
})
class EditTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            imageToken: '',
            turnOverMembersVisible: false
        }
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
        const {teamID, teamAvatar} =this.props.teams.team.info;
        teamAvatar != '' ? imgRequest('/team/ViewTeamAvatar', {
                teamID, avatar: teamAvatar
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
        const {teamID, teamAvatar} =nextProps.teams.team.info;
        if (this.props.teams.team.info.teamID != teamID) {
            teamAvatar != '' ? imgRequest('/team/ViewTeamAvatar', {
                    teamID, avatar: teamAvatar
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
        const {user, editTeam, history, teams, closeSlider}=this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => resolve(editTeam(user.access_token, user.refresh_token, teams.team.info.teamID, values.teamName, values.teamSummary, this.state.imageToken)))
                    .then(res => {
                        closeSlider();
                    })
            }
        });
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    showConfirm() {
        const {deleteTeam, teams, user, history}=this.props;
        confirm({
            title: '确定删除团队吗',
            content: '',
            onOk() {
                return new Promise(resolve => resolve(deleteTeam(user.access_token, user.refresh_token, teams.team.info.teamID))).then(res => {
                    history.goBack();
                })
            },
            onCancel() {
            },
        });
    }

    render() {
        const {closeSlider, teams, editTeam, deleteTeam, user, transformTeam}=this.props;
        let userMail = user.mail;
        let self = teams.team && _.find(teams.team.members, (member) => {
                return member.memberMail == userMail;
            });
        let isSetting = self && self.roleCode != "MEMBER" ? true : false;
        const {getFieldDecorator} = this.props.form;
        const teamI18n = team_i18n[user.lang];
        let owner = _.find(teams.team.members, (member) => {
            return member.roleCode == 'OWNER'
        });
        let manager = _.find(teams.team.members, (member) => {
            return member.roleCode == 'MANAGER'
        });
        let turnOverMembers = _.cloneDeep(teams.team.members);
        _.remove(turnOverMembers, (member) => {
            return member.memberMail == user.mail;
        });
        let bgImage = this.state.imageUrl ? this.state.imageUrl : '/image/login_bg.png';
        return <Form onSubmit={::this.handleSubmit}>
            <div>
                <div className="slider-hd">
                    <span>{teamI18n.teamInformation}</span>
                    <i className="iconfont icon-close" onClick={closeSlider}/>
                </div>
                <div className="slider-bd">
                    <div>
                        <FormItem>
                            <p className="title">{teamI18n.teamName}</p>
                            {getFieldDecorator('teamName', {
                                rules: [{required: true, message: `${teamI18n.inputTeamName}`}],
                                initialValue: teams.team && teams.team.info.teamName
                            })(
                                <Input placeholder={teamI18n.inputTeamName} disabled={!isSetting}/>
                            )}
                        </FormItem>
                    </div>
                    <div>
                        <FormItem>
                            <p className="title">{teamI18n.des}</p>
                            {
                                getFieldDecorator('teamSummary', {
                                    rules: [{required: true, message: `${teamI18n.inputTeamDes}`}],
                                    initialValue: teams.team && teams.team.info.teamSummary
                                })(<Input type="textarea" placeholder={teamI18n.inputTeamDes} disabled={!isSetting}/>)
                            }
                        </FormItem>
                    </div>
                    <div>
                        <FormItem>
                            <p className="title">{teamI18n.cover}</p>
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
                    <div>
                        <p className="title">{teamI18n.owner}</p>
                        <div className="clearfix">
                            <div className="liLeft">
                                <img src={`${apihost}/user/GetUserAvatar?selectUserMail=${owner.memberMail}`} alt=""/>
                                <span>{owner.memberName || owner.memberMail.split('@')[0]}</span>
                            </div>
                            {owner.memberMail == user.mail && <div className="liRight">
                                <button className="btn tran"
                                        onClick={this.setTurnOverMembersModaVisible.bind(this, true)}>{teamI18n.move}
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="slider-ft">
                    {isSetting &&
                    <Button type="primary" htmlType="submit" className="btn tran btnColor3">{teamI18n.move}</Button>}
                    {owner.memberMail == user.mail &&
                    <a className="iconYellow" onClick={::this.showConfirm}>{teamI18n.removeTeam}</a>}
                </div>
                <TurnOverMembers visible={this.state.turnOverMembersVisible}
                                 onCancel={this.setTurnOverMembersModaVisible.bind(this, false)}
                                 members={turnOverMembers}
                                 transform={transformTeam.bind(null, user.access_token, user.refresh_token, teams.team.info.teamID)}/>
            </div>
        </Form>
    }
}

export default Form.create()(EditTeam);