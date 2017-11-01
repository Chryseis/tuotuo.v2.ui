/**
 * Created by AllenFeng on 2017/6/1.
 */
import {request} from './request';
import {apihost} from '../constants/apiConfig';
import axios from 'axios';

export function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export function imgRequest(uri, params, callback, accessToken) {
    request(`${apihost}/${uri}`, {
        mode: 'cors',
        method: 'get',
        headers: {
            'Authorization': `bearer ${accessToken}`
        },
        queryParams: {
            ...params
        }
    }).then(res => {
        let contentType = res.headers.get('content-type');
        if (contentType == 'application/json') {
            return {
                code: 400,
                msg: res.json()
            }
        }
        return {
            code: 200,
            blob: res.blob()
        }
    }).then(img => {
        if (img.code == 200) {
            img.blob.then(blob => {
                let bgUrl = URL.createObjectURL(blob);
                callback(bgUrl)
            })
        } else {
            let bgUrl = '/image/setPass.png';
            callback(bgUrl)
        }
    })
}

export function imageRequest_2(uri, params, callback, accessToken, cancelToken) {
    axios({
        method: 'get',
        url: `${apihost}/${uri}`,
        headers: {'Authorization': `bearer ${accessToken}`},
        params: {
            ...params
        },
        cancelToken,
        responseType: 'blob'
    }).then(res => {
        let contentType = res.headers['content-type'];
        if (contentType != 'application/json') {
            let bgUrl = URL.createObjectURL(res.data);
            callback && callback(bgUrl)
        } else {
            let bgUrl = '/image/setPass.png';
            callback && callback(bgUrl)
        }
    })
}