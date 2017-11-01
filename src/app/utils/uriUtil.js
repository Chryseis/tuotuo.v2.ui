/**
 * Created by AllenFeng on 2017/4/12.
 */
const getQueryString = name => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    return r ? decodeURI(r[2]) : null;
}

export {getQueryString}