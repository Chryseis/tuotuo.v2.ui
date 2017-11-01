/**
 * Created by AllenFeng on 2017/6/13.
 */
import {Modal,message,Popconfirm} from 'antd';
import {apihost}  from '../../../constants/apiConfig';
import Message from '../common/message';

class TurnOverMembers extends React.Component {
    constructor(props) {
        super(props);
    }

    transform(mail){
        const {transform,onCancel}=this.props;
        new Promise(resolve=>resolve(transform(mail))).then(res=>{
            Message.info('移交成功');
            onCancel();
        })
    }

    render() {
        const {visible, onCancel, members,transform}=this.props;
        return <Modal wrapClassName="vertical-center-modal" visible={visible} closable={false} footer={null}>
            <div className="Popups">
                <a className="cancel iconfont icon-close" onClick={onCancel}/>
                <div className="p-cont p-giveOther">
                    <p className="p-title">移交项目</p>
                    <ul>
                        {members && members.length > 0 && members.map((member, i) => {
                            return <li className="tran clearfix" key={i}>
                                <div className="liLeft"><img  src={`${apihost}/user/GetUserAvatar?selectUserMail=${member.memberMail}`} alt=""/><span>{member.memberMail}</span>
                                </div>
                                <div className="liRight">
                                    <Popconfirm title="确定移交吗？" onConfirm={this.transform.bind(this,member.memberMail)} onCancel={() => {
                                    }} okText="是" cancelText="否">
                                        <button className="btn tran">移交</button>
                                    </Popconfirm>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </Modal>
    }
}

export default TurnOverMembers;