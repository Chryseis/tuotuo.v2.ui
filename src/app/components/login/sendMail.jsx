import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {sendMail, verifyEmailCode, resetAuthStatus, bindUser} from '../../actions/User';
import Button from '../common/button';
import renderField from '../common/renderField';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import {getCodeType} from '../common/common';
import {codeType, resCode} from '../../constants/common';
import login_i18n from '../../i18n/login_i18n';

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        sendMail: (mail, code, codeType, identity, reSendEmailToken) => dispatch(sendMail(mail, code, codeType, identity, reSendEmailToken)),
        verifyEmailCode: (mail, code, codeType) => dispatch(verifyEmailCode(mail, code, codeType)),
        resetAuthStatus: () => dispatch(resetAuthStatus()),
        bindUser: (mail, redisId, submitToken) => dispatch(bindUser(mail, redisId, submitToken))
    }
})
class SendMail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 10,
            remark: '',
            validationErrors: {}
        }
        this.timerId = '';
    }

    componentDidMount() {
        this._counter();
    }

    _counter() {
        this.timerId = setInterval(() => {
            this.setState(({timer}) => {
                if (timer > 0) {
                    return {
                        timer: timer - 1
                    }
                }
            }, () => {
                if (this.state.timer == 0) {
                    this.setState({
                        remark: 'resend'
                    });
                    clearInterval(this.timerId);
                }
            })
        }, 1000);
    }

    _resend() {
        const {sendMail, user, match}=this.props;
        let codeType = getCodeType(match);
        sendMail(user.mail, null, codeType, null, user.reSendMailToken);
        this.setState({
            timer: 10,
            remark: ''
        }, () => {
            this._counter();
        });
    }

    _submit(...args) {
        const {user, verifyEmailCode, match, bindUser}=this.props;
        let values = args[0];
        let type = getCodeType(match);
        const verifyCode = () => new Promise(resolve => resolve(verifyEmailCode(user.mail, values.emailAuthCode, type)));
        return verifyCode().then(json => {
            if (json.mailAuthCode == resCode.LogicError) {
                throw new SubmissionError({emailAuthCode: '验证码错误'});
            } else if (json.mailAuthCode == resCode.OK && type == codeType.binduser) {
                new Promise(resolve => resolve(bindUser(user.mail, user.relationAccountID, json.submitToken))).then(json => {
                    if (json.msg.code == resCode.LogicError) {
                        throw new SubmissionError({emailAuthCode: '邮箱已被绑定'});
                    }
                })
            }
        })
    }

    componentWillUnmount() {
        const {user, resetAuthStatus}=this.props;
        clearInterval(this.timerId);
        if (!user.authMailStatus) {
            resetAuthStatus();
        }
    }

    render() {
        const {user, match, handleSubmit}=this.props;
        let type = getCodeType(match);
        const loginI18n = login_i18n[user.lang];
        switch (type) {
            case codeType.register:
                if (user.authMailStatus) {
                    return <Redirect to="/register-setpassword"></Redirect>
                } else if (user.mail != '') {
                    return <div className="page">
                        <div className="loginPage">
                            <div className="box-cont">
                                <div className=" signVerify sign f-l">
                                    <img className="banner" src="image/banner.png" alt=""/>
                                    <p className="signTitle">{loginI18n.send} <a href={`mailto:${user.mail}`}
                                                                                 className="emailVerify">{user.mail}</a> {loginI18n.authcode}
                                    </p>
                                    <p className="signTitle">{loginI18n.inputCode}</p>
                                    <form onSubmit={handleSubmit(::this._submit)}>
                                        <Field name="emailAuthCode" icon="iconfont icon-yanzheng"
                                               inputClassName="signVerify-input" i18n={loginI18n} remark={this.state.remark}
                                               linkClassName="resend"
                                               placeholder={loginI18n.verficationCode} remind={this.state.timer}
                                               func={::this._resend} component={renderField}></Field>
                                        <Button value={loginI18n.next} loading={user.isFetch}></Button>
                                    </form>
                                    <p className="lm-ft"><Link to={{pathname: '/register'}}
                                                               className="move-first">{loginI18n.otherAccLogin}</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                } else {
                    return <Redirect to="/"></Redirect>
                }
            case codeType.binduser:
                if (user.authMailStatus && user.bindStatus) {
                    return <Redirect to="/thirdbind-complete"></Redirect>
                } else if (user.mail != '') {
                    return <div className="page">
                        <div className="loginPage">
                            <div className="box-cont">
                                <div className=" signVerify sign f-l">
                                    <img className="banner" src="image/banner.png" alt=""/>
                                    <p className="signTitle">{loginI18n.send} <a href={`mailto:${user.mail}`}
                                                                                 className="emailVerify">{user.mail}</a> {loginI18n.authcode}
                                    </p>
                                    <p className="signTitle">{loginI18n.inputCode}</p>
                                    <form onSubmit={handleSubmit(::this._submit)}>
                                        <Field name="emailAuthCode" icon="iconfont icon-yanzheng"
                                               inputClassName="signVerify-input" i18n={loginI18n} remark={this.state.remark}
                                               linkClassName="resend"
                                               placeholder={loginI18n.verficationCode} remind={this.state.timer}
                                               func={::this._resend} component={renderField}></Field>
                                        <Button value={loginI18n.next} loading={user.isFetch}></Button>
                                    </form>
                                    <p className="lm-ft"><Link to={{pathname: '/'}}
                                                               className="move-first">{loginI18n.reLogin}</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                } else {
                    return <Redirect to="/"></Redirect>
                }
            case codeType.findback:
                if (user.authMailStatus) {
                    return <Redirect to="/findback-setpassword"></Redirect>
                } else if (user.mail != '') {
                    return <div className="page">
                        <div className="loginPage">
                            <div className="box-cont">
                                <div className=" signVerify sign f-l">
                                    <img className="banner" src="image/banner.png" alt=""/>
                                    <p className="signTitle">{loginI18n.send} <a href={`mailto:${user.mail}`}
                                                                                  className="emailVerify">{user.mail}</a>{loginI18n.authcode}
                                    </p>
                                    <p className="signTitle">{loginI18n.inputCode}</p>
                                    <form onSubmit={handleSubmit(::this._submit)}>
                                        <Field name="emailAuthCode" icon="iconfont icon-yanzheng"
                                               inputClassName="signVerify-input" i18n={loginI18n} remark={this.state.remark}
                                               linkClassName="resend"
                                               placeholder={loginI18n.verficationCode} remind={this.state.timer}
                                               func={::this._resend} component={renderField}></Field>
                                        <Button value={loginI18n.next} loading={user.isFetch}></Button>
                                    </form>
                                    <p className="lm-ft"><Link to={{pathname: '/'}}
                                                               className="move-first">{loginI18n.reLogin}</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                } else {
                    return <Redirect to="/"></Redirect>
                }
        }
    }
}

//验证
const validate = values => {
    const errors = {}
    if (!values.emailAuthCode) {
        errors.emailAuthCode = '验证码不能为空';
    } else {
        if (values.emailAuthCode.length != 4) {
            errors.emailAuthCode = '验证码不正确';
        }
    }
    return errors
}

export default reduxForm({
    form: 'sendMail',
    validate
})(SendMail);