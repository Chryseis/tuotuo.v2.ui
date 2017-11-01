/**
 * Created by AllenFeng on 2017/6/7.
 */
import {slider as Action} from '../constants/actionType'

export function openSlider(nodeName) {
    return {
        type:Action.OPEN_SLIDER,
        nodeName
    }
}

export function closeSlider() {
    return{
        type:Action.CLOSE_SLIDER
    }
}