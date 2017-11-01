/**
 * Created by AllenFeng on 2017/8/28.
 */
import {Avatar, Card, Form, Input, Button, Upload, Row, Col, message} from 'antd';
import {apihost}  from '../../../constants/apiConfig';
import {getBase64} from '../../../utils/imgUtil';
import {resCode} from '../../../constants/common';
import Message from '../common/message';

class UserInfoTitle extends React.Component {

    render() {
        const {i18n}=this.props;
        return <Col span={6}>
            <Row>
                <Col span={24} className="title" style={{lineHeight: '100px', marginBottom: '24px'}}>{i18n.avatar}</Col>
                <Col span={24} className="title" style={{lineHeight: '50px', marginBottom: '24px'}}>{i18n.name}</Col>
                <Col span={24} className="title" style={{lineHeight: '50px', marginBottom: '24px'}}>{i18n.mobile}</Col>
                <Col span={24} className="title" style={{lineHeight: '50px', marginBottom: '24px'}}></Col>
            </Row>
        </Col>
    }
}

export default UserInfoTitle;
