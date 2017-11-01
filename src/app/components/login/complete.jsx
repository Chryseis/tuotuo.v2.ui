import {Link, Redirect} from 'react-router-dom';
import {getCodeType} from '../common/common';
import {codeType} from '../../constants/common';
import login_i18n from '../../i18n/login_i18n';
import {connect} from 'react-redux';

@connect(state => {
    return {
        user: state.user
    }
})
class Complete extends React.Component {
    render() {
        const {match,user}=this.props;
        const loginI18n = login_i18n[user.lang];
        let type = getCodeType(match);
        switch (type) {
            case codeType.register:
                return <div className="page">
                    <div className="loginPage">
                        <div className="box-cont">
                            <div className="signSuccess sign f-l">
                                <img className="banner" src="image/setSuccess.png" alt=""/>
                                <p className="signTitle">{loginI18n.registerSuccess}</p>
                                <Link to="/tuotuo/main"
                                      className="link-button"><span>{loginI18n.enterTuoTuo}</span></Link>
                                <p className="lm-ft"><a href=""
                                                        className=" move-first">{loginI18n.improvePerInfomation}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            case codeType.binduser:
                return <div className="page">
                    <div className="loginPage">
                        <div className="box-cont">
                            <div className="signSuccess sign f-l">
                                <img className="banner" src="image/setSuccess.png" alt=""/>
                                <p className="signTitle">{loginI18n.bindSuccess}</p>
                                <Link to="/tuotuo/main"
                                      className="link-button"><span>{loginI18n.enterTuoTuo}</span></Link>
                                <p className="lm-ft"><a href="" className=" move-first">{loginI18n.bindSuccess}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            case codeType.findback:
                return <div className="page">
                    <div className="loginPage">
                        <div className="box-cont">
                            <div className="signSuccess sign f-l">
                                <img className="banner" src="image/setSuccess.png" alt=""/>
                                <p className="signTitle">{loginI18n.resetPasswordSuccess}</p>
                                <Link to="/" className="link-button"><span>{loginI18n.reLogin}</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
        }
    }
}

export default  Complete;