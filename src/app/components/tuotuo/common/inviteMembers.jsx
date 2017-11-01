/**
 * Created by AllenFeng on 2017/6/6.
 */
import {Modal, Input, Icon} from 'antd';

class InviteMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchName: '',
            isShowSearch: false
        }
    }

    emitEmpty = () => {
        this.searchInput.focus();
        this.setState({searchName: '', isShowSearch: false});
    }

    onChangeSearchName = (e) => {
        if (e.target.value != '') {
            this.setState({searchName: e.target.value});
        } else {
            this.setState({searchName: e.target.value, isShowSearch: false})
        }
    }

    invite(members) {
        const {invite, getDetail}=this.props;
        new Promise(resolve => resolve(invite(members))).then(res => {
            this.setState({searchName: '', isShowSearch: false});
            getDetail();
        })
    }

    render() {
        const {visible, onCancel, searchTeam, searchList, invite, inviteMembers}=this.props;
        const {searchName, isShowSearch} = this.state;
        const suffix = searchName ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;
        let inviteMembersKey = _.keys(inviteMembers);

        return <Modal
            wrapClassName="vertical-center-modal" visible={visible} closable={false} footer={null}>
            <div className="Popups">
                <a className="cancel iconfont icon-close" onClick={onCancel}></a>
                <div className="p-cont p-addMember">
                    <p className="p-title">邀请新成员</p>
                    <div className="search">
                        <Input
                            placeholder="输入邮箱或关键字，回车搜索"
                            suffix={suffix}
                            value={searchName}
                            onPressEnter={e => {
                                let value = e.target.value;
                                if (value != '') {
                                    new Promise(resolve => resolve(searchTeam(value))).then(res => {
                                        this.searchKey = value;
                                        this.setState({isShowSearch: true})
                                    })
                                } else {
                                    this.setState({
                                        isShowSearch: false
                                    })
                                }
                            }}
                            onChange={this.onChangeSearchName}
                            ref={node => this.searchInput = node}
                        />
                        {
                            ((searchList.teamInfos && searchList.teamInfos.length > 0) || (searchList.teamMembers && searchList.teamMembers.length > 0)) ?
                                (isShowSearch && <div className="search-cont">

                                    {
                                        searchList.teamInfos.length > 0 && <div>
                                            <p className="title">团队</p>
                                            <ul className="">
                                                {searchList.teamInfos.map((item, i) => {
                                                    let owner = _.find(item.members, (member) => {
                                                        return member.roleCode = 'OWNER'
                                                    })
                                                    let inviteMembers = item.members.map((item, i) => {
                                                        return item.memberMail
                                                    })
                                                    let teamName = item.info.teamName;
                                                    let nameArray = teamName.split(this.searchKey);
                                                    return <a key={i}
                                                              onClick={this.invite.bind(this, inviteMembers)}>
                                                        <li className="tran">
                                                            <div className="liLeft"><span>{nameArray[0]}</span><span
                                                                className="lhColor">{this.searchKey}</span><span>{nameArray[1]}</span>
                                                            </div>
                                                            <div className="liRight"><i className="iconfont icon-owner iconYellow"/><span
                                                                className="unJoined">{owner.memberName || owner.memberMail}</span>
                                                            </div>
                                                        </li>
                                                    </a>
                                                })}
                                            </ul>
                                        </div>
                                    }
                                    { searchList.teamMembers.length > 0 && <div>
                                        <p className="title">成员</p>
                                        <ul className="">
                                            {
                                                searchList.teamMembers.map((item, i) => {
                                                    let memberName = item.memberName || item.memberMail;
                                                    let memberletterArray = item.memberName.length > this.searchKey.length && memberName.split(this.searchKey);
                                                    let memberMail = item.memberMail;
                                                    let mailletterArray = memberMail.split(this.searchKey);
                                                    return <a key={i}
                                                              onClick={this.invite.bind(this, [memberMail])}>
                                                        <li className="tran">
                                                            <div className="liLeft">
                                                                <span>{memberletterArray&&memberletterArray[0]}</span><span
                                                                className="lhColor">{this.searchKey}</span><span>{memberletterArray&&memberletterArray[1]}</span>
                                                            </div>
                                                            <div className="liRight" title={memberMail}>
                                                                <span>{mailletterArray[0]}</span><span
                                                                className="lhColor">{this.searchKey}</span><span>{mailletterArray[1]}</span>
                                                            </div>
                                                        </li>
                                                    </a>
                                                })
                                            }
                                        </ul>
                                    </div>
                                    }
                                </div>) : (isShowSearch && <div className="search-cont unfound">
                                    <img src="/image/lostError.png"/>
                                    <p>未找到此用户</p>
                                    <p className="email">{this.searchKey}</p>
                                    {/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.searchKey) &&
                                    <button className="btn" onClick={() => this.invite([this.searchKey])}>邀请</button>}
                                </div>)
                        }
                    </div>
                    <ul className="search-result">
                        {
                            inviteMembersKey.map((item, i) => {
                                return <li className="tran" key={i}>
                                    <div className="liLeft"><span>{item}</span></div>
                                    <div className="liRight"><span className={classnames({
                                        joined: inviteMembers[item] == 1,
                                        unJoined: inviteMembers[item] == 0
                                    })}>{inviteMembers[item] == 1 ? '已加入' : '待激活'}</span></div>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </Modal>
    }
}

export default InviteMembers;