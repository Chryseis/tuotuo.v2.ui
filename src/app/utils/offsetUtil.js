/**
 * Created by Administrator on 2017/8/26.
 */
const getStyleComputedProperty = (element, property) => {
    let css = window.getComputedStyle(element, null);
    return css[property];
}

const getScrollParent = (element) => {
    let parent = element.parentNode;

    if (!parent) {
        return element;
    }

    if (parent === document) {
        if (document.body.scrollTop) {
            return document.body;
        } else {
            return document.documentElement;
        }
    }

    if (
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1
    ) {
        return parent;
    }
    return getScrollParent(element.parentNode);
}


const getOffset = (elem) => {
    let offsetTop = elem && elem.offsetTop;
    let offsetLeft = elem && elem.offsetLeft;

    let scrollParent=getScrollParent(elem);
    let offsetParent = elem.offsetParent;
    offsetTop = offsetTop
    while (offsetParent !== document.body) {
        offsetTop += offsetParent.offsetTop ;
        offsetLeft += offsetParent.offsetLeft;
        offsetParent = offsetParent.offsetParent;
    }
    return {
        offsetTop:offsetTop-scrollParent.scrollTop,
        offsetLeft
    }
}

export default getOffset;