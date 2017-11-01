/**
 * Created by AllenFeng on 2017/8/28.
 */
import {Avatar, Card, Form, Input, Button, Upload, Row, Col, message} from 'antd';
import {apihost}  from '../../../constants/apiConfig';
import {getBase64} from '../../../utils/imgUtil';
import {resCode} from '../../../constants/common';
import Message from '../common/message';


const FormItem = Form.Item;
class UserInfoForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: `${apihost}/user/GetUserAvatar?selectUserMail=${props.user.mail}&t=${props.user.avatarTimestamp}`,
            imageToken: null
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
            beforeUpload: function (file) {
                const isJPG = 'image/jpeg,image/jpg,image/png'.indexOf(file.type) > -1;
                if (!isJPG) {
                    Message.error('图片类型只能是jpg,jpeg,png!', this.dom.children[0]);
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    Message.error('图片大小不能大于2MB', this.dom.children[0]);
                }
                return isJPG && isLt2M;
            }.bind(this),
            onChange: function (info) {
                if (info.file.status !== 'uploading') {

                }
                if (info.file.status === 'done') {
                    let imageToken = info.file.response.code == resCode.OK ? info.file.response.data[0].uploadToken : '';
                    getBase64(info.file.originFileObj, imageUrl => this.setState({avatar: imageUrl, imageToken}));
                } else if (info.file.status === 'error') {

                }
            }.bind(this)
        }
    }

    handleSubmit(e) {
        const {updateUser, user}=this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => resolve(updateUser(user.access_token, user.refresh_token, values.userName, this.state.imageToken, values.moblie))).then(res => {
                    if (res.msg.code == 8200) {
                        Message.success("修改成功！", this.dom.children[0])
                        //message.success('修改成功')
                    } else {
                        Message.error('修改失败', this.dom.children[0]);
                    }
                })
            }
        })


    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user.mail != nextProps.user.mail) {
            this.setState({avatar: `${apihost}/user/GetUserAvatar?selectUserMail=${nextProps.user.mail}&t=${nextProps.user.avatarTimestamp}`})
        }
    }

    render() {
        const {user, i18n}=this.props;
        const {getFieldDecorator} = this.props.form;
        return <div ref={(dom) => this.dom = dom}>
            <Col span={16}>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormItem>
                        <Row>
                            <Col span={24} style={{'height': 100}}>
                                <Avatar shape="circle" src={this.state.avatar}
                                        className="userHeadImg"/>
                                <Upload className="uploader"
                                        accept="image/*" {...this.uploadAttr}><Button>{i18n.changeAvatar}</Button></Upload>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span={24}>
                                {
                                    getFieldDecorator('userName', {
                                        initialValue: user.userName,
                                        rules: [{required: true, message: '请输入姓名'}]
                                    })(<Input className='cont' type="text" style={{'height': 50, 'fontSize': '18px'}}/>)
                                }
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span={24}>
                                {
                                    getFieldDecorator('moblie', {
                                        initialValue: user.mobile,
                                        rules: []
                                    })(<Input className='cont' style={{'height': 50, 'fontSize': '18px'}}/>)
                                }
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span={24}>
                                <Button type="primary" htmlType="submit" className="save">{i18n.save}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </Col>
        </div>
    }
}

export default Form.create()(UserInfoForm);