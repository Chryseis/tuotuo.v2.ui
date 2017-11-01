/**
 * Created by AllenFeng on 2017/5/2.
 */
import {request} from '../../utils/request';
import {apihost} from '../../constants/apiConfig';
import {getCodeType} from './common';
import {codeType} from '../../constants/common';

const asyncValidVerifyMail = (...args) => {
    let values = args[0];
    let props = args[2];
    let type = getCodeType(props.match)
    return request(`${apihost}/user/VerifyEmail`, {
        mode: 'cors',
        method: 'get',
        queryParams: {
            mail: values.mail
        }
    }).then(res => res.json()).then(json => {
        if (json.code == 8300) {
            if (type == codeType.register) {
                throw {mail: 'emailRegistered'}
            }
        } else {
            if (type != codeType.register) {
                throw {mail: 'emailNotRegister'}
            }
        }
    })
}

export {asyncValidVerifyMail}