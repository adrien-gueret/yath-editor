import { combineReducers } from 'redux';

import globalAppReducers from 'Modules/app/reducers';
import screens from 'Modules/screens/reducers';
import screensChoices from 'Modules/screensChoices/reducers';

export default combineReducers({
    ...globalAppReducers,
    screens,
    screensChoices,
});