import { combineReducers } from 'redux';

import { reducers as game } from 'Modules/game';
import { reducers as screens } from 'Modules/screens';
import { reducers as links } from 'Modules/links';
import { reducers as logic } from 'Modules/logic';
import { reducers as inventory } from 'Modules/inventory';

export default combineReducers({
    inventory,
    links,
    game,
    screens,
    logic,
});