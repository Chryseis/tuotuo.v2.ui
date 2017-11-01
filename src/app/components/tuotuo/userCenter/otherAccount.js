import {Avatar, Card, Form, Input, Button, Upload, Row, Col, message, Modal} from 'antd';
import {qqConfig} from '../../../constants/thirdPartyConfig'


class OtherAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            verifyIdentity: false
        }
    }

    componentDidMount() {
        const {user, getBindThirdPartyAccountList}=this.props;
        getBindThirdPartyAccountList(user.access_token, user.refresh_token);
    }

    filterThirdParty = (filterKey) => {
        const {thirdPartyList}=this.props.user;
        let thirdParty = _.find(thirdPartyList, (item) => {
            return item.from === filterKey;
        })
        return thirdParty
    }

    render() {
        const {user,history,unbindUser,i18n}=this.props;
        return <Card className="user-info">
            <Row className={`third-party ${this.filterThirdParty('wechat') ? 'unbind' : 'bind'}`}>
                <Col span={6}><i className="icon iconfont icon-weixin"/><span>微信</span></Col>
                <Col offset={12} span={4}>
                    {this.filterThirdParty('wechat') ? <a href="javascript:;">{i18n.unbind}</a> : <a href="javascript:;">{i18n.bind}</a>}
                </Col>
            </Row>
            <Row className={`third-party ${this.filterThirdParty('QQ') ? 'unbind' : 'bind'}`}>
                <Col span={6}><i className="icon iconfont icon-qq"/><span>QQ</span></Col>
                <Col offset={12} span={4}>
                    {this.filterThirdParty('QQ') ?
                        <a href="javascript:;" onClick={() => this.setState({verifyIdentity: true})}>{i18n.unbind}</a> :
                        <a href={`${qqConfig.authorizePath}?response_type=code&client_id=${qqConfig.appID}&redirect_uri=${qqConfig.inner_redirect_uri}&scope=get_user_info`}>{i18n.bind}</a>}
                </Col>
            </Row>
            <Row className={`third-party ${this.filterThirdParty('weibo') ? 'unbind' : 'bind'}`}>
                <Col span={6}><i className="icon iconfont icon-weibo"/><span>微博</span></Col>
                <Col offset={12} span={4}>
                    {this.filterThirdParty('weibo') ? <a href="javascript:;">{i18n.unbind}</a> : <a href="javascript:;">{i18n.bind}</a>}
                </Col>
            </Row>
            <Modal
                title={false}
                style={{top: 184}}
                visible={this.state.verifyIdentity}
                footer={false}
                closable={false}
                width={380}
            >
                <div className="verifyIdentity-body">
                    <p>解绑QQ后，你将无法使用QQ登录拓拓2</p>
                    <p style={{textAlign:'center',marginBottom:'29px'}}>你确定要解绑吗？</p>
                    <div className="toolbar">
                        <button className="third-party-btn cancel" onClick={()=>this.setState({
                            verifyIdentity:false
                        })}>取消
                        </button>
                        <button className="third-party-btn verify" onClick={()=>{
                            Promise.resolve(unbindUser(user.access_token,user.refresh_token,'QQ')).then(res=>{
                                this.setState({
                                    verifyIdentity:false
                                })
                            })
                        }}>确定
                        </button>
                    </div>
                </div>
            </Modal>
        </Card>
    }
}

export default OtherAccount;