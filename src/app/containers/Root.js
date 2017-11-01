/**
 * Created by AllenFeng on 2017/3/24.
 */
import {BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom'
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Login from '../components/login/login';
import Register from '../components/login/register';
import SendMail from '../components/login/sendMail';
import SetPassword from '../components/login/setPassword';
import Complete from '../components/login/complete';
import ThirdBind from '../components/login/thirdBind'
import {connect} from 'react-redux';
import Container from '../components/tuotuo/container';
import NoMatch from '../components/404/noMatch'
import Fade from '../components/tuotuo/common/fade'


const store = configureStore();

export default class Root extends React.Component {
    render() {
        return <Provider store={store}>
            <Router>
                <div style={{height:'100%'}}>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/login"/>}/>
                        <Route exact path="/login" render={(props)=><Fade {...props}><Login /></Fade>}/>
                        <Route path="/register" render={(props)=><Fade {...props}><Register /></Fade>}/>
                        <Route path="/register-sendmail" render={(props)=><Fade {...props}><SendMail /></Fade>}/>
                        <Route path="/register-setpassword" render={(props)=><Fade {...props}><SetPassword /></Fade>} />
                        <Route path="/register-complete" render={(props)=><Fade {...props}><Complete /></Fade>} />
                        <Route exact path="/findback" render={(props)=><Fade {...props}><Register /></Fade>}/>
                        <Route path="/findback-sendmail" render={(props)=><Fade {...props}><SendMail /></Fade>} />
                        <Route path="/findback-setpassword" render={(props)=><Fade {...props}><SetPassword /></Fade>} />
                        <Route path="/findback-complete"  render={(props)=><Fade {...props}><Complete /></Fade>} />
                        <Route path="/thirdbind" render={(props)=><Fade {...props}><ThirdBind /></Fade>}/>
                        <PrivateRoute  path="/tuotuo" component={Container}/>
                        <Route render={(props)=><Fade {...props}><NoMatch /></Fade>}/>
                    </Switch>
                </div>
            </Router>
        </Provider>
    }
}

@connect(state => {
    return {
        user: state.user
    }
})
class PrivateRoute extends React.Component{
    render(){
        const {component, ...rest}=this.props;
        return     <Route {...rest} render={props => (this.props.user.access_token? (React.createElement(component, props)) : (<Redirect to={{
                pathname: '/'
            }}></Redirect>))}/>
        // return     <Route {...rest} render={props => (true? (React.createElement(component, props)) : (<Redirect to={{
        //         pathname: '/'
        //     }}></Redirect>))}/>
    }
}