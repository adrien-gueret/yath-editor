import actionTypes from '../actions/types';

export default function isTesting(state = false, action) {
    switch(action.type) {
        case actionTypes.TEST_GAME:
            return true;

        case actionTypes.FINISH_TEST_GAME:
            return false;

        default:
            return state;
    }
}