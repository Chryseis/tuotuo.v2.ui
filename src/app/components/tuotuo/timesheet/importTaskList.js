/**
 * Created by WillWang on 2017/7/13.
 */
import ReactIScroll  from 'react-iscroll';
import iScroll from 'iscroll';
import moment from 'moment';
import {Row, Col, Icon, Button} from 'antd';
class ImportTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            date:+moment().format('x'),
            importTaskList: []
        })
    }

    handSubmit() {
        const {createTimeSheetTasks, myCompleteTaskList, popoverVisible ,resetSelectImportTask,i18n} = this.props;
        const selectTasks = _.filter(myCompleteTaskList, (item)=>{
            return item.selected == true
        });
        const importTasks = _.map(selectTasks, (item) =>{
            return{
                detail:item.title,
                projectID: item.projectID,
                time: item.time
            }
        });
        new Promise(resolve => resolve(createTimeSheetTasks(importTasks))).then(res =>{
            if(res){
                popoverVisible();
                resetSelectImportTask();
            }
        });
    }
   render() {
       const {myCompleteTaskList, selectImportTask,i18n} = this.props;
       return(

       <div className="ts-pop-whiteboard">
           <Row className="title">
               <Col span={24}>{i18n.todayWork}</Col>
           </Row>
           <div className="ts-whiteboard-wrapper">
               <ReactIScroll iScroll={iScroll} options={{
                   mouseWheel: true,
                   scrollbars: 'custom',
                   interactiveScrollbars: true,
                   disablePointer: true
               }}
                             onRefresh={(iScrollInstance) => {
                                 let hasVerticalScroll = iScrollInstance.y;
                                 if (this.state.canVerticallyScrollWhiteboard != hasVerticalScroll) {
                                     this.setState({canVerticallyScrollWhiteboard: hasVerticalScroll})
                                 }
                             }}>
                   {   myCompleteTaskList && myCompleteTaskList.length > 0 && myCompleteTaskList.map((item, i) => {
                       return(
                           <Row key={i} className="ts-whiteboard" onClick={()=>selectImportTask(item.taskID)}>
                               <Col span="16" className="task-name" title={item.title}>{item.title}</Col>
                               {item.selected && item.selected==true && <Col span="8" className="selected"><Icon type="check-circle-o"/></Col>}
                           </Row>)
                   } )}
               </ReactIScroll>
           </div>
           <Row className="foot">
               <Col><Button className="btn" onClick={() => this.handSubmit()}>{i18n.ok}</Button></Col>
           </Row>
       </div>
       )
   }
}
export default ImportTask;