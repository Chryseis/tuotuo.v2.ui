import {Link} from 'react-router-dom';
import {Input} from 'antd';
const renderField = ({name, icon, formClassName, inputClassName, linkClassName, placeholder, remark, func, imgUrl, remind, to, input, label, type,i18n, meta: {asyncValidating, touched, error}}) => {
    return <div className={formClassName ? `form-group ${formClassName}` : `form-group`}>
        <div className={classnames({
            "input": true,
            "borderSuccess": touched && !error,
            "borderError": touched && error
        })}>
            {icon && <em className={icon}
                         style={{color: (touched && !error) ? '#5899FC' : (touched && error) ? '#F85361' : ''}}></em>}
            <input {...input} name={name} className={inputClassName} type={type} placeholder={placeholder}/>
            {remind != undefined && remind != 0 && <span className="signVerify-time"><em>{remind}</em>s {i18n.after}</span>}
            {func && remark && remark != '' &&
            <a href="javascript:void(0)" className={linkClassName} onClick={func}>{i18n[remark]}</a>}
            {!func && remark && remark != '' && <Link className={linkClassName} to={to}>{i18n[remark]}</Link>}
        </div>
        {imgUrl && <img className="verifyPic" src={imgUrl} alt=""/>}
        {touched && error && <p className="error-notic">{i18n[error]}</p>}
    </div>
}

export default renderField;