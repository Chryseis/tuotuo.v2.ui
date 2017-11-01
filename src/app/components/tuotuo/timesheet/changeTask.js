/**
 * Created by WillWang on 2017/7/13.
 */
import {Row, Col, InputNumber, Input, Select, Icon, Form} from 'antd';

class ChangeTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreate: true
        }
    }

    taskSubmit = (e) => {
        if (this.state.isCreate) {
            let node = e.target;
            if (this.taskSub && !this.taskSub.contains(node)) {
                this.handleSubmit();
            }
        }
    };

    handleSubmit() {
        this.setState({isCreate: false});
        const {createTimeSheetTasks, onCancel, item, modifyTimeSheetTask, changeType, handleSub} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!item) {
                    //创建
                    new Promise(resolve => resolve(createTimeSheetTasks([values]))).then(res => {
                        if (res) {
                            this.setState({isCreate: true});
                            onCancel();
                            handleSub(true);
                        }
                    })
                } else {
                    //修改
                    new Promise(resolve => resolve(modifyTimeSheetTask(values.detail, values.projectID, values.time))).then(res => {
                        if (res) {
                            this.setState({isCreate: true});
                            changeType();
                            handleSub(true);
                        }
                    })
                }
            }
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.taskSubmit);
    };

    componentDidMount() {
        document.addEventListener('click', this.taskSubmit);
    }

    render() {
        const {onCancel, projectList, item, deleteTimeSheetTask, i18n} = this.props;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator}=this.props.form;
        return (
            <Form layout='inline' onSubmit={() => this.handleSubmit()}>
                <div ref={(taskSub) => this.taskSub = taskSub}>
                    <Row className="ts-tb-item tran active">
                        <Col span={13} className="left">
                            <FormItem
                                help={''}
                            >
                                {
                                    getFieldDecorator('detail', {
                                        rules: [{required: true, message: i18n.notBeNull, whitespace: true}],
                                        initialValue: item ? item.detail : ''
                                    })(<Input className="work-info" placeholder={i18n.inputWorkContent}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={7} className="middle">
                            <FormItem>
                                {
                                    getFieldDecorator('projectID', {
                                        rules: [{required: true, message: '请选择工作项目'}],
                                        initialValue: (item.projectID && item.projectID.toString()) || (projectList && projectList[0].projectID.toString())
                                    })(projectList && projectList.length > 0 && <Select className="select"
                                                                                        onChange={(value) => {
                                                                                        }}>
                                            {projectList.map((project, i) => {
                                                return <Option key={i} value={project.projectID.toString()}
                                                               title={project.projectName}>
                                                    <span className="ant-sel-middle">{project.projectName}</span>
                                                </Option>
                                            })}
                                        </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={4} className="right">
                            <FormItem
                                help={''}>
                                {
                                    getFieldDecorator('time', {
                                        rules: [{required: true}],
                                        initialValue: (item.time ? item.time : 1)
                                    })(<InputNumber className="num" min={0.5} onChange={(value) => {
                                    }}/>)
                                }
                            </FormItem>
                            <Icon className="delete" type="close-circle"
                                  onClick={item ? deleteTimeSheetTask : onCancel}/>
                        </Col>
                    </Row>
                </div>
            </Form>
        )
    }
}

export default Form.create()(ChangeTask);