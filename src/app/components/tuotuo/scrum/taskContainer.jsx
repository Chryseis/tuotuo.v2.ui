/**
 * Created by AllenFeng on 2017/6/30.
 */
import Task from './task';
import {DropTarget} from 'react-dnd';


const taskTarget = {
    drop(props, monitor){
        let taskID = monitor.getItem().id;
        props.onDrop(taskID,props.state)
    }
}
@DropTarget(props => props.targetType, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
class TaskContainer extends React.Component {
    render() {
        const {canDrop, isOver, connectDropTarget,tasks, state, editTask,sourceType,scrumI18n} =this.props;
        return connectDropTarget(<td className="taskboard-cell">
            {
                _.map(_.filter(tasks, {state}), (task, i) => {
                    return <Task title={task.title} time={task.time} key={i} userMail={task.assignedEmail} userName={task.assignedName}
                                 editTask={editTask.bind(null, task)} sourceType={sourceType} id={task.taskID} scrumI18n={scrumI18n}/>
                })
            }
        </td>)
    }
}

export default TaskContainer