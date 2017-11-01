/**
 * Created by AllenFeng on 2017/8/3.
 */
import {Button} from  'antd'

class NoMatch extends React.Component{
    render(){
        const{history}=this.props;
        return <div className="nomatch-wrapper">
            <div className="nomatch-img"></div>
            <p className="nomatch-reminder">啊哦~您要访问的页面不存在,请点击下面的按钮返回首页</p>
            <div className="btn-wrapper"> <Button className="entry-btn" type="primary" onClick={()=>history.push('/')}>返回首页</Button></div>
        </div>
    }
}

export default NoMatch;