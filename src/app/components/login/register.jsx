/**
 * Created by Administrator on 2017/4/18.
 */
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {loadAuthImg, verifyAuthCode, sendMail} from '../../actions/User';
import Guid from 'guid';
import Button from '../common/button';
import renderField from '../common/renderField';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import {asyncValidVerifyMail} from '../common/asyncValidates';
import {getCodeType} from '../common/common';
import {codeType} from '../../constants/common';
import login_i18n from '../../i18n/login_i18n';

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        loadImg: (identity) => dispatch(loadAuthImg(identity)),
        verifyCode: (identity, code, mail) => dispatch(verifyAuthCode(identity, code, mail)),
        sendMail: (mail, code, codeType, identity, reSendEmailToken) => dispatch(sendMail(mail, code, codeType, identity, reSendEmailToken))
    }
})
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.guid = '';
        this._refreshImg();
    }

    _refreshImg() {
        this.guid = Guid.create();
        this.props.loadImg(this.guid.value);
    }

    _submit(...args) {
        let values = args[0];
        const {sendMail, match}=this.props;
        let codeType = getCodeType(match);
        const verify = () => new Promise(resolve => resolve(sendMail(values.mail, values.authcode, codeType, this.guid.value)));
        return verify().then(json => {
            if (json.authCode == 8500) {
                this._refreshImg();
                throw new SubmissionError({authcode: '验证码错误'});
            }
        })
    }


    render() {
        const {user, match, handleSubmit}=this.props;
        const loginI18n = login_i18n[user.lang];
        let type = getCodeType(match);
        switch (type) {
            case codeType.register:
                return !user.authStatus ? <div className="page">
                        <div className="loginPage">
                            <div className="box-cont">
                                <div className="signUp sign f-l">
                                    <img className="banner" src="image/banner.png" alt=""/>
                                    <p className="signTitle">{loginI18n.registNewAcc}</p>
                                    <form onSubmit={handleSubmit(::this._submit)}>
                                        <Field name="mail" i18n={loginI18n} type="text" icon="iconfont icon-email"
                                               inputClassName="mail"
                                               placeholder={loginI18n.email} component={renderField}></Field>
                                        <Field name="authcode" i18n={loginI18n} formClassName="signUp-verify"
                                               inputClassName="signUp-verify-input"
                                               type="text" placeholder={loginI18n.verficationCode}
                                               linkClassName="refresh"
                                               func={::this._refreshImg}
                                               remark={'refresh'} imgUrl={user.authImg}
                                               component={renderField}></Field>
                                        <Button value={loginI18n.registration} loading={user.isFetch}/>
                                    </form>
                                    <p className="lm-ft">{loginI18n.alreadyLogin} <Link
                                        to="/login">{loginI18n.login}</Link></p>
                                </div>
                            </div>
                        </div>
                    </div> : <Redirect to="/register-sendmail"></Redirect>
            case codeType.binduser:
                if (user.relationAccountID == '') {
                    return <Redirect to="/"></Redirect>
                } else if (!user.authStatus) {
                    return <div className="page">
                        <div className="loginPage">
                            <div className="box-cont">
                                <div className="signUp sign f-l">
                                    <img className="banner" src="image/banner.png" alt=""/>
                                    <p className="signTitle">绑定现有账号</p>
                                    <form onSubmit={handleSubmit(::this._submit)}>
                                        <Field name="mail" i18n={loginI18n} type="text" icon="iconfont icon-email "
                                               inputClassName="mail"
                                               placeholder={loginI18n.email} component={renderField}></Field>
                                        <Field name="authcode" i18n={loginI18n} formClassName="signUp-verify"
                                               inputClassName="signUp-verify-input"
                                               type="text" placeholder={loginI18n.verficationCode}
                                               linkClassName="refresh"
                                               func={::this._refreshImg}
                                               remark={'refresh'} imgUrl={user.authImg}
                                               component={renderField}></Field>
                                        <Button value={loginI18n.next} loading={user.isFetch}/>
                                    </form>
                                    <p className="lm-ft">{loginI18n.alreadyLogin} <Link
                                        to="/login">{loginI18n.login}</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                } else {
                    return <Redirect to="/thirdbind-sendmail"></Redirect>
                }
            case codeType.findback:
                return !user.authStatus ? <div className="page">
                        <div className="loginPage">
                            <div className="box-cont">
                                <div className="signUp sign f-l">
                                    <img className="banner" src="image/banner.png" alt=""/>
                                    <p className="signTitle">{loginI18n.findBack}</p>
                                    <form onSubmit={handleSubmit(::this._submit)}>
                                        <Field name="mail" i18n={loginI18n} type="text" icon="iconfont icon-email"
                                               inputClassName="email"
                                               placeholder={loginI18n.email} component={renderField}></Field>
                                        <Field name="authcode" i18n={loginI18n} formClassName="signUp-verify"
                                               inputClassName="signUp-verify-input"
                                               type="text" placeholder={loginI18n.verficationCode}
                                               linkClassName="refresh"
                                               func={::this._refreshImg}
                                               remark={'refresh'} imgUrl={user.authImg}
                                               component={renderField}></Field>
                                        <Button value={loginI18n.next} loading={user.isFetch}/>
                                    </form>
                                    <p className="lm-ft"><Link to="/login">{loginI18n.reLogin}</Link></p>
                                </div>
                            </div>
                        </div>
                    </div> : <Redirect to="/findback-sendmail"></Redirect>
        }
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

    if (!values.authcode) {
        errors.authcode = 'verficationCodeNotNull';
    }
    return errors
}

export default reduxForm({
    form: 'register',
    validate,
    asyncValidate: asyncValidVerifyMail,
    asyncBlurFields: ['mail']
})(Register);