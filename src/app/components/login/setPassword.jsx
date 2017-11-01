import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {resetAuthStatus, registUser, editPassword} from '../../actions/User';
import Button from '../common/button';
import renderField from '../common/renderField';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import {asyncValidVerifyCode} from '../common/asyncValidates'
import {getCodeType} from '../common/common';
import {codeType} from '../../constants/common';
import login_i18n from '../../i18n/login_i18n';

@connect(state => {
    return {
        user: state.user
    }
}, dispatch => {
    return {
        resetAuthStatus: () => dispatch(resetAuthStatus()),
        registUser: (mail, password,submitToken,redisId) => dispatch(registUser(mail, password,submitToken,redisId)),
        editPassword: (mail, password,submitToken) => dispatch(editPassword(mail, password,submitToken))
    }
})
class SetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validationErrors: {}
        }

    }

    _submit(data) {
        const {user, registUser, editPassword, match}=this.props;
        let type = getCodeType(match);
        if (type==codeType.register) {
            const regist=()=>new Promise(resolve=>resolve(registUser(user.mail, data.password,user.submitToken,user.relationAccountID)));
            return regist().then(json=>{
                if(json.code==8500){
                    throw new SubmissionError({repassword: '注册失败'});
                }
            })

        } else if(type==codeType.findback) {
            const edit=()=>new Promise(resolve=>resolve(editPassword(user.mail, data.password,user.submitToken)));
            return edit().then(json=>{
                if(json.code==8500){
                    throw new SubmissionError({repassword: '修改失败'});
                }
            })
        }
    }

    componentWillUnmount() {
        this.props.resetAuthStatus();
    }

    render() {
        const {user, match, handleSubmit}=this.props;
        const loginI18n = login_i18n[user.lang];
        let type = getCodeType(match);
        if (type==codeType.register) {
            if (user.registStatus) {
                return <Redirect to="/register-complete"></Redirect>
            } else if (user.mail == '') {
                return <Redirect to="/register"></Redirect>
            } else {
                return <div className="page">
                    <div className="loginPage">
                        <div className="box-cont">
                            <div className="signPassword sign f-l">
                                <img className="banner" src="image/banner.png" alt=""/>
                                <p className="signTitle">{loginI18n.setPassword}</p>
                                <form onSubmit={handleSubmit(::this._submit)}>
                                    <Field name="password" type="password" i18n={loginI18n} placeholder={loginI18n.inputPassword}
                                           inputClassName="sign-input" component={renderField}></Field>
                                    <Field name="repassword" type="password" i18n={loginI18n} placeholder={loginI18n.reinputPassword}
                                           inputClassName="sign-input" component={renderField}></Field>
                                    <Button value={loginI18n.registerComplete} isFetch={false}></Button>
                                </form>
                                <p className="lm-ft"><Link to={{pathname: '/register'}}
                                                           className="move-first">{loginI18n.otherAccRegister}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        } else if(type==codeType.findback) {
            if (user.registStatus) {
                return <Redirect to="/findback-complete"></Redirect>
            } else if (user.mail == '') {
                return <Redirect to="/findback"></Redirect>
            } else {
                return <div className="page">
                    <div className="loginPage">
                        <div className="box-cont">
                            <div className="signPassword sign f-l">
                                <img className="banner" src="image/banner.png" alt=""/>
                                <p className="signTitle">设置密码</p>
                                <form onSubmit={handleSubmit(::this._submit)}>
                                    <Field name="password" type="password" i18n={loginI18n} placeholder={loginI18n.inputPassword}
                                           inputClassName="sign-input" component={renderField}></Field>
                                    <Field name="repassword" type="password" i18n={loginI18n} placeholder={loginI18n.reinputPassword}
                                           inputClassName="sign-input" component={renderField}></Field>
                                    <Button value={loginI18n.reset} isFetch={false}></Button>
                                </form>
                                <p className="lm-ft"><Link to={{pathname: '/'}} className="move-first">{loginI18n.reLogin}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        }
    }
}

//验证
const validate = values => {
    const errors = {}
    if (!values.password) {
        errors.password='passwordNotNull';
    } else {
        if (values.password.length < 8) {
            errors.password='passwordNotLess8';
        }
    }

    if (!values.repassword) {
        errors.repassword='passwordNotNull';
    } else {
        if (values.repassword.length < 8) {
            errors.repassword='passwordNotLess8';
        } else if (values.password != values.repassword) {
            errors.repassword='两次密码不一致';
        }
    }
    return errors
}

export default reduxForm({
    form: 'setPassword',
    validate
})(SetPassword);