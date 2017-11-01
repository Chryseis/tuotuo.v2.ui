import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {Form, Input, Button, Upload, Row, Col} from 'antd';
import {addTeams} from '../../../actions/Teams';
import {apihost} from '../../../constants/apiConfig';
import {getBase64} from '../../../utils/imgUtil';
import {resCode} from '../../../constants/common';
import BackToMain from '../common/backToMain';
import team_i18n from '../../../i18n/team_i18n';

const FormItem = Form.Item;

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        addTeams: (accessToken, refreshToken, teamName, teamSummary, avatarToken) => dispatch(addTeams(accessToken, refreshToken, teamName, teamSummary, avatarToken))
    }
})
class AddTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            imageToken: ''
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

    handleSubmint(e) {
        e.preventDefault();
        const {user, addTeams, history}=this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => resolve(addTeams(user.access_token, user.refresh_token, values.teamName, values.teamSummary, this.state.imageToken)))
                    .then(res => {
                        history.goBack();
                    })
            }
        });
    }

    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const {history, user}=this.props;
        const {getFieldDecorator} = this.props.form;
        const bgImage = this.state.imageUrl ? this.state.imageUrl : '/image/card-bg.png';
        const teamI18n = team_i18n[user.lang];
        return (
            <Form onSubmit={(e) => this.handleSubmint(e)} className="addProTeam page-cont">
                <Row type="flex" justify="center">
                    <Col span={4}>
                        <h2>{teamI18n.newTeam}</h2>
                    </Col>
                    <Col span={8}></Col>
                </Row>

                <BackToMain history={history}/>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Col span={4} className="title">{teamI18n.teamName}</Col>
                        <Col span={8}>
                            {
                                getFieldDecorator('teamName', {
                                    rules: [{required: true, message: `${teamI18n.inputTeamName}!`}],
                                })(<Input className="cont" type="text"/>)
                            }
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Col span={4} className="title">{teamI18n.des}</Col>
                        <Col span={8}>
                            {
                                getFieldDecorator('teamSummary', {
                                    rules: [{required: true, message: `${teamI18n.inputTeamDes}!`}]
                                })(<Input className="cont" type="textarea"/>)
                            }
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Col span={4} className="title">{teamI18n.cover}</Col>
                        <Col span={8}>
                            {
                                getFieldDecorator('upload', {
                                    valueTeamName: 'fileList',
                                    getValueFromEvent: this.normFile
                                })(<Upload {...this.uploadAttr}>
                                        {
                                            <div className=" upImg bgStyle" style={{backgroundImage: `url(${bgImage})`}}>
                                                <a className="upImg-icon tran"><i
                                                    className="iconfont icon-cloud-upload"></i></a>
                                            </div>
                                        }
                                    </Upload>
                                )
                            }
                        </Col>
                    </Row>

                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Col span={4} className="title"></Col>
                        <Col span={8}>
                            <Button type="primary" htmlType="submit" className="btn cont">
                                {teamI18n.newTeam}
                            </Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        )
    }
}
export default Form.create()(AddTeam);