/**
 * Created by AllenFeng on 2017/4/17.
 */
import {Link, Redirect} from 'react-router-dom';
import Button from '../common/button';
import {connect} from 'react-redux';
import {login, resetAuthStatus, changeLang} from '../../actions/User';
import {juyueConfig, qqConfig} from '../../constants/thirdPartyConfig';
import renderField from '../common/renderField';
import login_i18n from '../../i18n/login_i18n';

import {Field, reduxForm, SubmissionError} from 'redux-form';

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        login: (mail, password) => dispatch(login(mail, password)),
        changeLang: () => dispatch(changeLang())
    }
})
class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    _submit(data) {
        const {login} = this.props;
        const loginUser = () => new Promise(resolve => resolve(login(data.mail, data.password)));
        return loginUser().then(json => {
            if (json.msg.error) {
                throw new SubmissionError({mail: json.msg.error_description});
            }
        })
    }

    render() {
        const {user, handleSubmit,changeLang} = this.props;
        const loginI18n = login_i18n[user.lang];
        return (!user.access_token ? (<div style={{height:'100vh'}}>
            <span className="lang" style={{top:'20px',zIndex:'100'}} onClick={() => changeLang()}>{`${user.lang == 'en' ? 'zh' : 'en'}`}</span>
            <div className="page"></div>
            <div className="loginPage">
                <div className="box-cont">
                    <div className="login-con sign f-l">
                        <img className="banner" src="image/banner.png" alt=""/>
                        <form onSubmit={handleSubmit(::this._submit)}>
                            <Field name="mail" icon="iconfont icon-email" inputClassName="email" type="text"
                                   placeholder={loginI18n.email} i18n={loginI18n} component={renderField}></Field>
                            <Field name="password" icon="iconfont icon-lock" inputClassName="password"
                                   type="password"
                                   placeholder={loginI18n.password} i18n={loginI18n} remark={'forgotPassword'}
                                   linkClassName="forgetPass" to="/findback"
                                   component={renderField}></Field>
                            <Button value={loginI18n.login} loading={user.isFetch}/>
                        </form>
                        <p className="otherLogin">{loginI18n.thirdPartyAuth}</p>
                        <div className="otherLink">
                            <a className="btn iconfont icon-weixin tran"
                               href={`${juyueConfig.authorizePath}?response_type=${juyueConfig.repsonse_type}&client_id=${juyueConfig.client_id}&redirect_uri=${juyueConfig.redirect_uri}`}></a>
                            <a className="btn iconfont icon-qq tran"
                               href={`${qqConfig.authorizePath}?response_type=code&client_id=${qqConfig.appID}&redirect_uri=${qqConfig.redirect_uri}&scope=get_user_info`}></a>
                            <a className="btn iconfont icon-weibo tran" href="javascript:void(0)"></a>
                        </div>
                        <p className="lm-ft">{loginI18n.noAccount}<Link className="move-next"
                                                                        to="/register">{loginI18n.registNewAcc}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>) : <Redirect to={{
            pathname: '/tuotuo/main'
        }}></Redirect>)
    }
}

//验证
const validate = values => {
    const errors = {};
    if (!values.mail) {
        errors.mail = 'emailNotNull';
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
    form: 'login',
    validate
})(Login)