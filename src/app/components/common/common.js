/**
 * Created by AllenFeng on 2017/5/12.
 */
import {codeType} from '../../constants/common'

const getCodeType=(match)=>{
    let path=match.path;
    if(path.startsWith('/findback')){
        return codeType.findback;
    }else if(path.startsWith('/third')){
        return codeType.binduser;
    }else if(path.startsWith('/register')){
        return codeType.register;
    }
}

export {getCodeType}