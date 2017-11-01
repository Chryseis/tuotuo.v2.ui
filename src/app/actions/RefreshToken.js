/**
 * Created by AllenFeng on 2017/5/31.
 */
import {user as Action} from '../constants/actionType';
import {request} from '../utils/request';
import {apihost} from '../constants/apiConfig';


export function getNewAccessToken(dispatch,refreshToken, callback,args) {
    return request(`${apihost}/token`, {
        mode: 'cors',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    }).then(res => res.json())
        .then(json => {
            if (json.error) {
                dispatch({
                    type: Action.CLEAR_TOKEN
                })
            } else {
                args?dispatch(callback(json.access_token, json.refresh_token,...args)):dispatch(callback(json.access_token, json.refresh_token));
                dispatch({
                    type: Action.LOGIN_USER,
                    msg: json
                })
            }
        })
}