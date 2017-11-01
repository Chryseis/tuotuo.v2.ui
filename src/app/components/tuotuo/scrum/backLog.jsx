/**
 * Created by AllenFeng on 2017/6/19.
 */
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import {Dropdown, Menu, Icon} from 'antd'


const BacklogSource = {
    canDrag(props){
        return true;
    },
    beginDrag(props){
        return props.backlog;
    }
};
@DragSource(props => props.sourceType, BacklogSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
class BackLog extends React.Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    };

    state = {
        visible: false
    };

    handleVisibleChange = (flag, e) => {
        this.setState({visible: flag})
    };

    menu = () => {
        const {deleteBacklog,backlog}=this.props;
        return <Menu>
            <Menu.Item>
                <a className="backlog-delete" onClick={(e)=>{e.stopPropagation();deleteBacklog(backlog.ID)}}><Icon type="delete"/>删除</a>
            </Menu.Item>
        </Menu>
    };

    render() {
        const {isDragging, connectDragSource, backlog, editBacklog} = this.props;
        let bgc = "#5899FC";
        switch (backlog.state){
            case 1:
            case 2:
                bgc='#5899FC';
                break;
            case 3:
                bgc='#33c9ba';
                break;
            case 5:
                bgc='#FD8A5C';
                break;
        }
        return connectDragSource(<li className="backlog-item tran" onClick={editBacklog.bind(null, backlog)}>
            <div className="item-Level" style={{background:`${bgc}`}}>{backlog.level}</div>
            <div className="item-content">
                <p className="item-content-title" title={backlog.title}>{backlog.title}</p>
                <div className="item-content-msg">
                    <span>{`#${backlog.ID}`}</span>
                    <span><i className="iconfont icon-users"/>{backlog.assignUserName || backlog.assignUserMail.split('@')[0]}</span>
                    <span><i className="iconfont icon-folder"/>{backlog.projectName}</span>
                </div>
            </div>
            <Dropdown overlay={this.menu()} onClick={(e) => {
                e.stopPropagation()
            }} onVisibleChange={this.handleVisibleChange} visible={this.state.visible} trigger={['click']}>
                <a className="proMore iconfont icon-more"/>
            </Dropdown>
        </li>)
    }
}

export default BackLog;