/**
 * Created by AllenFeng on 2017/6/30.
 */
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import {Tooltip} from 'antd';
import {apihost}  from '../../../constants/apiConfig';

const taskSource={
    canDrag(props){
        return true;
    },
    beginDrag(props){
        return props
    }
};

@DragSource(props => props.sourceType, taskSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
class Task extends React.Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    };

    render() {
        const {title,time,userMail, userName, taskID,editTask,isDragging, connectDragSource} =this.props;
        return connectDragSource(<div className="tb-tile tran" onClick={editTask}>
            <div className="tb-tile-content tran">
                <Tooltip  title={title}>
                    <div className="wit-title">
                        {title}
                    </div>
                </Tooltip>
                <div className="wit-extra">
                    <div className="wit-remaining-time">{time}<span>h</span></div>
                    <Tooltip title={userName}>
                        <img src={`${apihost}/user/GetUserAvatar?selectUserMail=${userMail}`} className="userImg"/>
                    </Tooltip>
                </div>
            </div>
        </div>)
    }
}

export default Task;