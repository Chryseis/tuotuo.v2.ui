/**
 * Created by AllenFeng on 2017/8/28.
 */
import {Avatar, Card, Form, Input, Button, Upload, Row, Col, message} from 'antd';
import UserInfoTitle from './userInfoTitle';
import UserInfoForm from './userInfoForm'

const FormItem = Form.Item;
class UserInfoWrapper extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const {user,updateUser,i18n}=this.props;
        return <Card className="user-info">
            <UserInfoTitle i18n={i18n} />
            <UserInfoForm user={user} updateUser={updateUser} i18n={i18n} />
            <Col span={4}/>
        </Card>
    }
}

export default UserInfoWrapper;