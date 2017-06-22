import {
    SET_EDIT_SCREEN,
    UNSET_EDIT_SCREEN
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

export default editScreenId;
