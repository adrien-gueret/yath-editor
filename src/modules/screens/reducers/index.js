import { combineReducers } from 'redux';
import editedScreenId from './editedScreenId';
import list from './list';

export default combineReducers({
    editedScreenId,
    list,
});