/**
 * Created by AllenFeng on 2017/6/5.
 */
import {Popover, Select, Popconfirm, message, Row, Col, Card, Tooltip} from 'antd';
import {resCode, roleName} from '../../../constants/common';
import {apihost} from'../../../constants/apiConfig';
import Message from '../common/message';

const Option = Select.Option;
//MemberPopover(this.showOrHide.bind(this), ::this.handleChange,::changeMemberRoleCode ,member.tags, member, ::this.exitProject, ownerMail, userMail,::this.removeMember,type,userRole)
const deleteCont = (<div className="deleteMember">
    <p>确定删除该成员？</p>
</div>);
const MemberPopover = (close, handleChange, changeMemberRoleCode, defaultValue, member, exit, owner, me, removeMember, type, userRole, i18n) => {

    return (
        <div className="memberSetting">
            <div className="ms-cont clearfix tran">
                <a className="card-cancel" onClick={close}>
                    <i className="iconfont icon-del"/>
                </a>
                <img className="pt-memberPic" src={`${apihost}/user/GetUserAvatar?selectUserMail=${member.memberMail}`}
                     alt=""/>
                <div className="pt-memberIntro">
                    <p className="mt-name">{member.memberName}</p>
                    <span className="mt-email">{member.memberMail}</span>
                </div>
                <div className="cd-msg">
                    <div>
                        <span className="title">{i18n.rights}</span>
                        {
                            userRole != "OWNER" || (userRole == "OWNER" && member.roleCode == "OWNER") ?
                                <span className="cont">{roleName[member.roleCode]}</span> :
                                <Select className="cont2" size="small" style={{width: '70%'}} tokenSeparators={[',']}
                                        onChange={changeMemberRoleCode} defaultValue={roleName[member.roleCode]}>
                                    <Option value="MANAGER">{i18n.manager}</Option>
                                    <Option value="MEMBER">{i18n.member}</Option>
                                </Select>
                        }
                    </div>
                    <div>
                        <span className="title">{i18n.memberTag}</span>
                        {userRole == "OWNER" ?
                            <Select mode="tags" className="cont" style={{width: '70%'}} tokenSeparators={[',']}
                                    onChange={handleChange} defaultValue={defaultValue}></Select> :
                            <ul className="memberTagList">
                                {member.tags && member.tags.length > 0 && member.tags.map((item, i) => {
                                    return <li key={i}>{item}</li>
                                })}
                            </ul>
                        }
                    </div>
                    <div><span className="title">{i18n.mobile}</span><span className="cont">{member.mobile}</span></div>
                </div>
            </div>
            {/* member.state 0=已邀请 1=通同意*/}
            {(member.state == 1 && member.memberMail == me) &&
            <Popconfirm overlayClassName="deleteMember" title={i18n.exitSure} onConfirm={exit} onCancel={() => {
            }} okText={i18n.yes} cancelText={i18n.no}>
                <p className="btn btnColor1"><a>{i18n.exit}</a></p>
            </Popconfirm> }
            {owner == me && member.state != 1 &&
            <p className="btn btnColor2"><span>{i18n.userActivate}<a>{i18n.resend}</a></span></p>}
            { member.memberMail != me && (userRole == "OWNER" || userRole == "MANAGER" ) &&
            <Popconfirm overlayClassName="deleteMember" title={i18n.removeMemberSure} onConfirm={removeMember}
                        onCancel={() => {
                        }} okText={i18n.yes} cancelText={i18n.no}>
                <p className="btn btnColor2"><a>{i18n.removeMember}</a></p>
            </Popconfirm> }
        </div>
    )
};

class MemberCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            avatar: null
        }
    }

    showOrHide() {
        this.setState({
            visible: !this.state.visible
        })
    }

    handleChange(value) {
        const {changeMemberTag, member}=this.props;
        changeMemberTag(member.memberMail, value);
    }

    changeMemberRoleCode(value) {
        const {changeMemberRoleCode, member}=this.props;
        changeMemberRoleCode(member.memberMail, value);
    }

    exit() {
        const {exit, member, history, dom}=this.props;
        new Promise(resolve => resolve(exit(member.memberMail))).then(json => {
            if (json.msg.code != resCode.OK) {
                Message.warning(json.msg.message, dom, 'down');
            } else {
                history.goBack()
            }
        })
    }

    removeMember() {
        const {removeMember, member, history, dom}=this.props;
        new Promise(resolve => resolve(removeMember(member.memberMail))).then(json => {
            if (json.msg.code != resCode.OK) {
                Message.info('删除失败！', dom, 'down');
            } else {
                //this.showOrHide();
            }
        })
    }

    render() {
        const {member, ownerMail, userMail, type, userRole, i18n}=this.props;
        const memberRole = member.roleCode;
        return (
            <Col span={8}>
                <Popover
                    overlayClassName="memberSetting-container"
                    content={MemberPopover(this.showOrHide.bind(this), ::this.handleChange, ::this.changeMemberRoleCode, member.tags, member, ::this.exit, ownerMail, userMail, ::this.removeMember, type, userRole, i18n)}
                    placement="bottom" trigger="click" visible={this.state.visible}
                    onVisibleChange={::this.showOrHide}>
                    <Card className="card " ref={(dom) => this.dom = dom}>
                        <div className="card-msg clearfix tran">
                            <img className="pt-memberPic"
                                 src={`${apihost}/user/GetUserAvatar?selectUserMail=${member.memberMail}`} alt=""/>
                            <div className="pt-memberIntro">
                                <p className="mt-name">{member.memberName || member.memberMail.split('@')[0]}
                                    {memberRole == "OWNER" ?
                                        <Tooltip title={i18n.owner}><i className="iconfont icon-owner iconYellow"/>
                                        </Tooltip> :
                                        memberRole == "MANAGER" ?
                                            <Tooltip title={i18n.Manager}><i
                                                className="iconfont icon-administrator iconYellow"/></Tooltip>
                                            : (member.state != 1 &&
                                            <Tooltip title={i18n.toJoin}><i
                                                className="iconfont icon-inactivated"/></Tooltip>)}
                                </p>
                                <span className="mt-email">{member.memberMail}</span>
                                <ul className="memberTagList">
                                    {member.tags && member.tags.length > 0 && member.tags.map((item, i) => {
                                        return <li key={i}>{item}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </Popover>
            </Col>
        )
    }
}
export default MemberCards;