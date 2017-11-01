/**
 * Created by AllenFeng on 2017/6/7.
 */
import EditProject from '../project/editProject';
import EditTeam from '../team/editTeam';
import {sliderName} from '../../../constants/common'

export function sliderContent(nodeName) {
    switch (nodeName){
        case sliderName.EditProject:return EditProject;
        case sliderName.EditTeam:return EditTeam;
        default:return <div></div>
    }
}