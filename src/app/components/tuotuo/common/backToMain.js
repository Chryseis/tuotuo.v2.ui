/**
 * Created by AllenFeng on 2017/7/18.
 */
const redirect = (uri, history) => {
    history.push(uri)
}

const BackToMain = ({history}) => <a className="back iconfont icon-back tran" onClick={(e) => {
    e.preventDefault();

    history.goBack();
    // redirect('/tuotuo/main', history)
}}/>

export default BackToMain;