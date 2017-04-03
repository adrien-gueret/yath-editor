import Screen from 'Modules/screens/models/Screen';
import { ADD_SCREEN } from 'Modules/screens/actions';

const INITIAL_STATE = {
    screens: [ new Screen('First screen') ],
};

function appReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADD_SCREEN:
            const screens = [ ...state.screens, action.screen ];
            return { screens };
        break;

        default:
            return state;
    }
}

export default appReducer;