import { combineReducers } from 'redux';

import screens from 'Modules/screens/reducers';
import screensChoices from 'Modules/screensChoices/reducers';

export default combineReducers({
    screens,
    screensChoices,
});