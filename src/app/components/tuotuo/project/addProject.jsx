/**
 * Created by AllenFeng on 2017/5/26.
 */
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {Form, Input, Button, Upload, Row, Col} from 'antd';
import {addProjects} from '../../../actions/Projects';
import {apihost} from '../../../constants/apiConfig';
import {getBase64} from '../../../utils/imgUtil';
import {resCode} from '../../../constants/common';
import BackToMain from '../common/backToMain';
import project_i18n from '../../../i18n/project_i18n';

const FormItem = Form.Item;

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        addProjects: (accessToken, refreshToken, projectName, projectSummary, avatarToken) => dispatch(addProjects(accessToken, refreshToken, projectName, projectSummary, avatarToken)),

    }
})
class AddProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            imageToken: ''
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

    handleSubmit = (e) => {
        e.preventDefault();
        const {user, addProjects, history}=this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => resolve(addProjects(user.access_token, user.refresh_token, values.projectName, values.projectSummary, this.state.imageToken)))
                    .then(res => {
                        history.goBack();
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

    render() {
        const {history, user}=this.props;
        const {getFieldDecorator} = this.props.form;
        const projectI18n = project_i18n[user.lang]
        let bgImage = this.state.imageUrl ? this.state.imageUrl : '/image/card-bg2.png';
        return <Form onSubmit={::this.handleSubmit} className="addProTeam page-cont">
            <Row type="flex" justify="center">
                <Col span={4}>
                    <h2>{projectI18n.newProject}</h2>
                </Col>
                <Col span={8}></Col>
            </Row>
            <BackToMain history={history}/>
            <FormItem>
                <Row type="flex" justify="center">
                    <Col span={4} className="title">{projectI18n.projectName}</Col>
                    <Col span={8}>
                        {
                            getFieldDecorator('projectName', {
                                rules: [{required: true, message: `${projectI18n.inputProjectName}!`}],
                            })(<Input className="cont" type="text" placeholder=""/>)
                        }
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row type="flex" justify="center">
                    <Col span={4} className="title">{projectI18n.des}</Col>
                    <Col span={8}>
                        {
                            getFieldDecorator('projectSummary', {
                                rules: [{required: true, message: `${projectI18n.inputProjectDes}!`}],
                            })(<Input className="cont" type="textarea" placeholder=""/>)
                        }
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row type="flex" justify="center">
                    <Col span={4} className="title">{projectI18n.cover}</Col>
                    <Col span={8}>
                        {
                            getFieldDecorator('upload', {
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                            })(<Upload  {...this.uploadAttr}>
                                {
                                    <div className=" upImg bgStyle" style={{backgroundImage: `url(${bgImage})`}}>
                                        <a className="upImg-icon tran"><i className="iconfont icon-cloud-upload"/></a>
                                    </div>
                                }

                            </Upload>)
                        }
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row type="flex" justify="center">
                    <Col span={4} className="title"></Col>
                    <Col span={8}>
                        <Button type="primary" htmlType="submit" className="btn cont">
                            {projectI18n.newProject}
                        </Button>
                    </Col>
                </Row>
            </FormItem>
        </Form>
    }
}

export default Form.create()(AddProject);