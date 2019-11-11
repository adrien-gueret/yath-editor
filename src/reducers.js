import { combineReducers } from 'redux';

import { reducers as game } from 'Modules/game';
import { reducers as screens } from 'Modules/screens';
import { reducers as screensChoices } from 'Modules/screensChoices';

export default combineReducers({
    screensChoices,
    game,
    screens,
});