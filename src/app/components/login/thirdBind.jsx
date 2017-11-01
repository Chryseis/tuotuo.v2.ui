import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindUserV2, thirdLogin} from '../../actions/User';
import Button from '../common/button';
import renderField from '../common/renderField';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import {asyncValidVerifyMail} from '../common/asyncValidates';
import {getCodeType, resCode} from '../../constants/common';
import {codeType} from '../../constants/common';
import {getQueryString} from '../../utils/uriUtil';
import {juyueConfig, qqConfig} from '../../constants/thirdPartyConfig';
import Fade from '../tuotuo/common/fade';
import login_i18n from '../../i18n/login_i18n';

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        bindUserV2: (mail, password, redisId) => dispatch(bindUserV2(mail, password, redisId)),
        thirdLogin: (code, redirectUri, agent) => dispatch(thirdLogin(code, redirectUri, agent))
    }
})
class ThirdBind extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            status: 0
        }


    }

    componentDidMount() {
        const {thirdLogin, history}=this.props;
        let agent = getQueryString('agent');
        let code = getQueryString('code');

        switch (agent) {
            case 'juyue':
                Promise.resolve(thirdLogin(code, juyueConfig.redirect_uri, 'cas')).then(res => {
                    history.push(`/thirdBind`)
                })
                break;
            case 'qq':
                Promise.resolve(thirdLogin(code, qqConfig.redirect_uri, 'qq')).then(res => {
                    history.push('/thirdBind')
                });
                break;
            default:
                this.setState({
                    status: 1
                })
                break;
        }
    }

    _submit(...args) {
        const {user, match, bindUserV2}=this.props;
        let values = args[0];
        const bind = () => new Promise(resolve => resolve(bindUserV2(values.mail, values.password, user.relationAccountID)));
        return bind().then(json => {
            if (json.msg.code == resCode.UserInputValidateError) {

            } else if (json.msg.code == resCode.LogicError) {
                throw new SubmissionError({password: json.msg.message});
            } else if (json.msg.code != resCode.OK) {
                throw new SubmissionError({password: '信息有误，请重新绑定'});
            }
        })
    }


    render() {
        const {user, match, handleSubmit}=this.props;
        const loginI18n = login_i18n[user.lang];
        if (user.access_token) {
            return <Redirect to="/tuotuo/main"/>
        } else if (user.cas_error && user.cas_error != '' && user.relationAccountID != '') {
            return <Fade className="thirdBind">
                <div className="page">
                    <div className="loginPage">
                        <div className="box-cont">
                            <div className="signUp sign f-l">
                                <img className="banner" src="image/banner.png" alt=""/>
                                <form onSubmit={handleSubmit(::this._submit)}>
                                    <Field name="mail" type="text" icon="iconfont icon-email" inputClassName="mail"
                                           placeholder={loginI18n.email} component={renderField}></Field>
                                    <Field name="password" icon="iconfont icon-lock" inputClassName="password"
                                           type="password"
                                           placeholder={loginI18n.password} remark="忘记密码？" linkClassName="forgetPass" to="/findback"
                                           component={renderField}></Field>
                                    <div className="form-group">
                                        <Button value="绑定并登录" loading={user.isFetch}/>
                                    </div>
                                    <Link to="/register" className="link-button white"><span>没有账号？注册登录</span></Link>
                                </form>
                                <p className="lm-ft">已有账号？<Link to="/">登录</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        } else if (!user.cas_error && this.state.status != 1) {
            return <div className="bg-loading" style={{height: '100vh'}}></div>
        } else {
            return <Redirect to="/login"/>
        }
    }
}

//验证
const validate = values => {
    const errors = {}
    if (!values.mail) {
        errors.mail = '邮箱不能为空';
    } else {
        let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(values.mail)) {
            errors.mail = '邮箱格式不正确';
        }
    }
    if (!values.password) {
        errors.password = '密码不能为空'
    } else {
        if (values.password.length < 8) {
            errors.password = '密码不能少于8位'
        }
    }
    return errors
}

export default reduxForm({
    form: 'thirdBind',
    validate,
    asyncValidate: asyncValidVerifyMail,
    asyncBlurFields: ['mail']
})(ThirdBind);