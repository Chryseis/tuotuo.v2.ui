/**
 * Created by AllenFeng on 2017/4/17.
 */
/*按钮组件*/
const Button=({value='登 录',loading=false,bgcolor})=>{
    return <button type="submit" className={bgcolor?`btn loginBtn pr tran ${bgcolor}`:`btn loginBtn pr tran`}>
        {value}
        {loading&&<img className="loading" src="/image/loading.gif" alt="加载..."  />}
    </button>
}

export default Button;