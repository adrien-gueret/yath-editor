import { combineReducers } from 'redux';

import {
    SET_EDIT_SCREEN,
    UNSET_EDIT_SCREEN,
    TEST_GAME,
    FINISH_TEST_GAME,
} from 'Modules/app/actions';

function editScreenId(state = null, action) {
    switch (action.type) {
       case SET_EDIT_SCREEN: {
            return action.payload.screenId;
        }

        case UNSET_EDIT_SCREEN: {
            return null;
        }

        default:
            return state;
    }
}

function gameTesting(state = false, action) {
    switch(action.type) {
        case TEST_GAME:
            return true;

        case FINISH_TEST_GAME:
            return false;

        default:
            return state;
    }
}

export default {
    editScreenId,
    gameTesting,
};
