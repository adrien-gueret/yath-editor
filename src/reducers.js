import { combineReducers } from 'redux';

import screensChoices from 'Modules/screensChoices/reducers';

import { reducers as game } from 'Modules/game';
import { reducers as screens } from 'Modules/screens';

export default combineReducers({
    screensChoices,
    game,
    screens,
});