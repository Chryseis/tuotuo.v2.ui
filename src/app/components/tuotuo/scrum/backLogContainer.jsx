/**
 * Created by AllenFeng on 2017/6/19.
 */
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';
import BackLog from './backLog';
import ReactIScroll  from 'react-iscroll';
import iScroll from 'iscroll'

class BackLogContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {backlogList, sourceType, editBacklog, deleteBacklog}=this.props;
        return <ReactIScroll iScroll={iScroll} options={{
            mouseWheel: true,
            scrollbars: 'custom',
            interactiveScrollbars: true,
            disablePointer: true
        }} onScrollStart={() => {

        }}
                             onRefresh={(iScrollInstance) => {
                                 let hasVerticalScroll = iScrollInstance.y;
                                 if (this.state.canVerticallyScroll != hasVerticalScroll) {
                                     this.setState({canVerticallyScroll: hasVerticalScroll})
                                 }
                             }}>
            <ul>
                {backlogList.map((item, i) => {
                    return <BackLog key={i} type="backLog" sourceType={sourceType} backlog={item}
                                    editBacklog={editBacklog} deleteBacklog={deleteBacklog}></BackLog>
                })}
            </ul>
        </ReactIScroll>
    }
}

const backLogTarget = {
    drop(props, monitor) {
        let backlog = monitor.getItem();
        props.onDrop(props.moveSprintID, backlog);
    },
}
@DropTarget(props => props.targetType, backLogTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
class BackLogTarget extends React.Component {
    render() {
        const {canDrop, isOver, connectDropTarget, backlogList, type, sourceType, editBacklog, deleteBacklog} = this.props;
        return connectDropTarget(<div className="content contenBacklog">{backlogList && backlogList.length > 0 ?
            <BackLogContainer backlogList={backlogList} sourceType={sourceType} editBacklog={editBacklog}
                              deleteBacklog={deleteBacklog}/> :
            <img className="BacklogPic" src={type == 'backlog' ? '/image/addBacklog.png' : '/image/dragBacklog.png'}
                 height="170" width="550"/>}</div>)
    }
}

export default BackLogTarget;