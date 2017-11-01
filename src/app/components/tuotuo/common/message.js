/**
 * Created by AllenFeng on 2017/8/25.
 */
import Notification from './notification'
import {Icon} from 'antd';
import getOffset from '../../../utils/offsetUtil'
import '../../../../styles/icon2/iconfont.css';

let messageInstance;
let defaultDuration =0.9;
let prefixCls = 'global-message';
let key = 1;
let defaultStyle = {top: 0, left: '50%'};
let offsetObj;

function computePosition(dom, offsetObj, direction) {
    let startPosition;
    let middlePosition;
    let endPosition;
    if (direction == 'up') {
        if (dom && dom.clientHeight > document.body.clientHeight) {
            startPosition = document.body.clientHeight;
            middlePosition = document.body.clientHeight / 2;
            endPosition = document.body.clientHeight - offsetObj.offsetTop;
        } else {
            startPosition = document.body.clientHeight - offsetObj.offsetTop - dom.clientHeight;
            middlePosition = document.body.clientHeight - offsetObj.offsetTop - dom.clientHeight / 2;
            endPosition = document.body.clientHeight;
        }
    } else {
        if (dom && dom.clientHeight > document.body.clientHeight) {
            startPosition = offsetObj.offsetTop;
            middlePosition = document.body.clientHeight / 2;
            endPosition = document.body.clientHeight;
        } else {
            startPosition = offsetObj.offsetTop;
            middlePosition = offsetObj.offsetTop + dom.clientHeight / 2;
            endPosition = document.body.clientHeight;
        }
    }

    return {startPosition, middlePosition, endPosition}
}

function getMessageInstance(dom, direction) {
    if (!messageInstance) {
        offsetObj = getOffset(dom);
        let leftPosition = offsetObj.offsetLeft + dom.clientWidth / 2;
        let {startPosition, middlePosition, endPosition}=computePosition(dom, offsetObj, direction);
        messageInstance = Notification.newInstance({
            prefixCls,
            transitionName: 'toggle',
            style: {top: direction == 'up' ? document.body.clientHeight : 0, left: leftPosition + 'px'} || defaultStyle,
            handleEnter(elem){
                direction == 'up' ? elem.style.bottom = (startPosition + elem.clientHeight) + 'px' : elem.style.top = startPosition + 'px'
            },
            handleEntering(elem){
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            },
            handleEntered(elem){
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            },
            handleExit(elem) {
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            },
            handleExiting (elem) {
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            }
        })
    } else if (!_.isEqual(offsetObj, getOffset(dom))) {
        messageInstance.destroy();
        offsetObj = getOffset(dom);
        let leftPosition = offsetObj.offsetLeft + dom.clientWidth / 2;
        let {startPosition, middlePosition, endPosition}=computePosition(dom, offsetObj, direction);

        messageInstance = Notification.newInstance({
            prefixCls,
            transitionName: 'toggle',
            style: {top: direction == 'up' ? document.body.clientHeight : 0, left: leftPosition + 'px'} || defaultStyle,
            handleEnter(elem){
                direction == 'up' ? elem.style.bottom = (startPosition + elem.clientHeight) + 'px' : elem.style.top = startPosition + 'px'
            },
            handleEntering(elem){
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            },
            handleEntered(elem){
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            },
            handleExit(elem) {
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            },
            handleExiting (elem) {
                direction == 'up' ? elem.style.bottom = (middlePosition + elem.clientHeight / 2) + 'px' : elem.style.top = (middlePosition - elem.clientHeight / 2) + 'px'
            }
        })
    }

    return messageInstance;
}

function notice(content, duration = defaultDuration, type, onClose, dom = document.getElementById('container'), direction) {
    let instance = getMessageInstance(dom, direction);
    let iconType = ({
        info: 'icon-tishi',
        success: 'icon-zhengque',
        error: 'icon-cuowu',
        warning: 'icon-tishi',
        loading: 'loading',
    })[type];
    instance.notice({
        key,
        duration,
        style: {right: '50%'},
        content: (<div className={`${prefixCls}-custom-content ${type}` }>
            <i  className={`icon iconfont ${iconType}`}/>
            <span>{content}</span>
        </div>),
        onClose
    });
    return (function () {
        let target = key++;
        return function () {
            instance.removeNotice(target);
        }
    }())
}

export default {
    info(content, dom, direction = 'up', duration, onClose){
        return notice(content, duration, 'info', onClose, dom, direction);
    },
    success(content, dom, direction = 'up', duration, onClose){
        return notice(content, duration, 'success', onClose, dom, direction);
    },
    warning(content, dom, direction = 'up', duration, onClose){
        return notice(content, duration, 'warning', onClose, dom, direction);
    },
    error(content, dom, direction = 'up', duration, onClose){
        return notice(content, duration, 'error', onClose, dom, direction);
    },
}
