import actionTypes from '../actions/types';

export default function editedScreenId(state = null, action) {
    switch (action.type) {
       case actionTypes.SET_EDIT_SCREEN: {
            return action.payload.screenId;
        }

        case actionTypes.UNSET_EDIT_SCREEN: {
            return null;
        }

        default:
            return state;
    }
}