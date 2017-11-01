/**
 * Created by AllenFeng on 2017/8/22.
 */
import {Avatar, Card, Form, Input, Button, Upload, Row, Col, message} from 'antd';
import {apihost}  from '../../../constants/apiConfig';
import Message from '../common/message';
const FormItem = Form.Item;


class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user, updatePassword}=this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => resolve(updatePassword(user.access_token, user.refresh_token, user.mail, values.oldPassword, values.newPassword))).then(res => {
                    if (res.msg.code == 8200) {
                        Message.success('修改成功', this.dom.children[0])
                    } else {
                        Message.error('修改失败', this.dom.children[0])
                    }
                    this.props.form.resetFields();
                })
            }
        })

    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('密码不一致');
        } else {
            callback();
        }
    }

    render() {
        const {user, i18n}=this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Card className="user-info">
                <Col span={6}>
                    <Row>
                        <Col span={24} className="title"
                             style={{lineHeight: '50px', marginBottom: '24px'}}>{i18n.email}</Col>
                        <Col span={24} className="title"
                             style={{lineHeight: '50px', marginBottom: '24px'}}>{i18n.oldPassword}</Col>
                        <Col span={24} className="title"
                             style={{lineHeight: '50px', marginBottom: '24px'}}>{i18n.newPassword}</Col>
                        <Col span={24} className="title"
                             style={{lineHeight: '50px', marginBottom: '24px'}}>{i18n.confirmPassword}</Col>
                        <Col span={24} className="title" style={{lineHeight: '50px', marginBottom: '24px'}}></Col>
                    </Row>
                </Col>
                <div ref={(dom) => this.dom = dom}>
                    <Col span={16}>
                        <Form className="" onSubmit={(e) => this.handleSubmit(e)}>
                            <FormItem>
                                <Row>
                                    <Col span={24} style={{lineHeight: '50px', fontSize: '18px'}}>
                                        {user.mail}
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span={24}>
                                        {
                                            getFieldDecorator('oldPassword', {
                                                rules: [{required: true, message: '请填写旧密码'}, {
                                                    min: 8,
                                                    message: '密码不能少于8位'
                                                }]
                                            })(<Input className='cont' type="password"
                                                      style={{'height': 50, 'fontSize': '18px'}}/>)
                                        }
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span={24}>
                                        {
                                            getFieldDecorator('newPassword', {
                                                rules: [{required: true, message: '请填写新密码'}, {
                                                    min: 8,
                                                    message: '密码不能少于8位'
                                                }]
                                            })(<Input className='cont' type="password"
                                                      style={{'height': 50, fontSize: '18px'}}/>)
                                        }
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span={24}>
                                        {
                                            getFieldDecorator('confirmPassword', {
                                                rules: [{required: true, message: '请填写确认密码'}, {
                                                    min: 8,
                                                    message: '密码不能少于8位'
                                                }, {validator: this.checkPassword}]
                                            })(<Input className='cont' type="password"
                                                      style={{'height': 50, fontSize: '18px'}}/>)
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
                        </Form >
                    </Col>
                </div>

                <Col span={4}/>
            </Card>
        )
    }
}

export default Form.create()(ResetPassword)