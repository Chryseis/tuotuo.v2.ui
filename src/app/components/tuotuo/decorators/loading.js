/**
 * Created by AllenFeng on 2017/8/23.
 */
import {connect} from 'react-redux'
import {getUser} from '../../../actions/User'

const loading = (DecoratorsComponent) => {
    @connect(state => ({
        user: state.user
    }), dispatch => {
        return {
            getUser: (accessToken, refreshToken) => dispatch(getUser(accessToken, refreshToken)),
        }
    })
    class Loading extends React.Component {
        componentDidMount() {
            const {getUser,user}=this.props;
            getUser(user.access_token, user.refresh_token);
        }

        render() {
            const {user}=this.props;
            return user.mail != '' ? <DecoratorsComponent {...this.props}></DecoratorsComponent> : <div className="bg-loading"></div>
        }
    }
    return Loading;
}

export default loading;