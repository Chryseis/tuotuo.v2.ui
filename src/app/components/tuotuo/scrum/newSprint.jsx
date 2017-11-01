/**
 * Created by AllenFeng on 2017/6/26.
 */
import {DatePicker, Form} from 'antd';


const {RangePicker} = DatePicker;
const FormItem = Form.Item;
class NewSprint extends React.Component {
    handleSubmit = (e) => {
        const {createSprint, onCancel, getReleaseAndSprintList}=this.props;
        e.preventDefault();

        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                new Promise(resolve => resolve(createSprint(+fieldsValue.sprintDate[0], +fieldsValue.sprintDate[1]))).then(res => {
                    if(res){
                        getReleaseAndSprintList();
                    }
                });
                onCancel();
            }
        })
    }

    render() {
        const {no, onCancel}=this.props;
        const {getFieldDecorator}=this.props.form;

        return <Form layout="inline" onSubmit={::this.handleSubmit}>
            <li>
                <span className="sprint-v">{`sprint${no}`}</span>
                <FormItem>
                     <span className="sprint-date add">
                        {
                            getFieldDecorator('sprintDate', {
                                rules: [{type: 'array', required: true, message: 'Please select time!'}]
                            })(<RangePicker allowClear={false} />)
                        }
                     </span>
                </FormItem>
                <span className="sprint-tool"><button type="submit" className="iconfont icon-ok-sign sure"/><i
                    className="iconfont icon-del del" onClick={onCancel}/></span>
            </li>
        </Form>
    }
}

export default Form.create()(NewSprint);