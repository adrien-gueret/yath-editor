import { combineReducers } from 'redux';

import editScreenId from 'Modules/app/reducers';
import screens from 'Modules/screens/reducers';
import screensChoices from 'Modules/screensChoices/reducers';

export default combineReducers({
    editScreenId,
    screens,
    screensChoices,
});