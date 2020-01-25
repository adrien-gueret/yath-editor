import actionTypes from '../actions/types';

export default function isTesting(state = 'My yath game', action) {
    switch(action.type) {
        case actionTypes.RENAME_GAME:
            return action.payload.name;

        default:
            return state;
    }
}