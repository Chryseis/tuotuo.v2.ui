import {Row, Col,Icon} from 'antd';
import ChangeTask from './changeTask';

class TimeSheetTask extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        const {onCancel, projectList, item, changeType, createTimeSheetTasks, modifyTimeSheetTask, deleteTimeSheetTask, handleSub, status,i18n} = this.props;
        const selectedProject = item && _.find(projectList, (project) => {
                return project.projectID == item.projectID
            });
        return(
            <div>
                {
                    (!item || item.type == true) ?
                        (<ChangeTask
                            projectList = {projectList}
                            item = {item ? item: ''}
                            createTimeSheetTasks = {createTimeSheetTasks}
                            modifyTimeSheetTask = {modifyTimeSheetTask}
                            deleteTimeSheetTask = {deleteTimeSheetTask}
                            onCancel = {onCancel}
                            changeType = {changeType}
                            handleSub = {handleSub}
                            i18n={i18n}
                        />):

                        (<Row className="ts-tb-item tran" onClick={()=>{handleSub();changeType?changeType():''}}>
                            <Col span={12} className="left">{item.detail}</Col>
                            <Col span={8} className="middle">{ selectedProject.projectName}</Col>
                            <Col span={4} className="right">
                                {item.time}
                                {status != 2?<Icon className="delete" type="close-circle" onClick={(e)=>{ e.stopPropagation();deleteTimeSheetTask();}}/>:''}
                                </Col>
                        </Row>)

                }
            </div>
        )
    }
}

export default TimeSheetTask;