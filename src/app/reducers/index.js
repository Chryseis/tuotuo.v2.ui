/**
 * Created by AllenFeng on 2017/3/24.
 */
import {user} from './User';
import {projects} from './Projects';
import {slider} from './Slider'
import {teams} from './Teams';
import {scrum} from './Scrum';
import {timeSheet} from './TimeSheet';
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

const reducer=combineReducers({
    user,
    projects,
    slider,
    teams,
    scrum,
    timeSheet,
    form:formReducer
});

export default reducer;