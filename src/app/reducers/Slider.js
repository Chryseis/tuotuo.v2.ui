/**
 * Created by AllenFeng on 2017/6/7.
 */
import {slider as Action} from '../constants/actionType';
import {sliderContent} from '../components/tuotuo/common/sliderContent'

const initialState = {
    isOpen: false,
    sliderContent:'div'
}

const reducersMap = {
    [Action.OPEN_SLIDER]: (state, action) => {
        return {
            isOpen: true,
            sliderContent:sliderContent(action.nodeName)
        }
    },
    [Action.CLOSE_SLIDER]: (state, action) => {
        return {isOpen: false}
    }
}

export function slider(state = initialState, action) {
    const reduceFn = reducersMap[action.type];
    if (!reduceFn) {
        return state;
    }
    return Object.assign({}, state, reduceFn(state, action))
}