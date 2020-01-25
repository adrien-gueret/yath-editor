import actionTypes from '../actions/types';

export default function isConfiguring(state = false, action) {
    switch(action.type) {
        case actionTypes.CONFIGURE_GAME:
            return true;

        case actionTypes.FINISH_CONFIGURE_GAME:
            return false;

        default:
            return state;
    }
}