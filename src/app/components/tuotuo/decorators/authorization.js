/**
 * Created by AllenFeng on 2017/8/2.
 */
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom';

const authorization = (DecoratorsComponent) => {
    @connect(state => ({
        user: state.user
    }))
    class Authorization extends React.Component {

        hasRights = () => {
            const {match, user}=this.props;
            let roleList = user.roleList;
            if (_.find(roleList, (role) => role.relationID == match.params.id && (role.roleCode == 'OWNER' || role.roleCode == 'MANAGER')&& role.roleType==1)) {
                return true
            }
            return false;
        }

        render() {
            return (this.hasRights() ? <DecoratorsComponent {...this.props} /> : <Redirect to="/tuotuo/main"/>)
        }
    }

    return Authorization
}

export default authorization;