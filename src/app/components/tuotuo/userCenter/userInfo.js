import {Avatar, Card, Form, Input, Button, Upload, Row, Col, message} from 'antd';
import {apihost}  from '../../../constants/apiConfig';
import {getBase64} from '../../../utils/imgUtil';
import {resCode} from '../../../constants/common';
import Message from '../common/message';
const FormItem = Form.Item;
class UserInfo extends React.Component {
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
                    Message.error('图片类型只能是jpg,jpeg,png!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    Message.error('图片大小不能大于2MB');
                }
                return isJPG && isLt2M;
            },
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
                        Message.success("修改成功！",this.dom.container)
                    } else {
                        Message.error('修改失败')
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
        const {user}=this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Card className="user-info" ref={(dom) => this.dom = dom}>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormItem>
                        <Row>
                            <Col span={6} className="title" style={{lineHeight: '100px'}}>头像</Col>
                            <Col span={16} style={{'height': 100}}>
                                <Avatar shape="circle" src={this.state.avatar}
                                        className="userHeadImg"/>
                                <Upload className="uploader"
                                         {...this.uploadAttr}><Button>更换头像</Button></Upload>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span={6} className="title" style={{lineHeight: '50px'}}>姓名</Col>
                            <Col span={16}>
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
                            <Col span={6} className="title" style={{lineHeight: '50px'}}>联系电话</Col>
                            <Col span={16}>
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
                            <Col span={6} className="title"></Col>
                            <Col span={16}>
                                <Button type="primary" htmlType="submit" className="save">保存</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form >
            </Card>
        )
    }
}

export default Form.create()(UserInfo);