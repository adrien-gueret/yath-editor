import {
    ADD_SCREEN_CHOICE,
    EDIT_SCREEN_CHOICE_LABEL,
    EDIT_SCREEN_CHOICE_TARGET,
} from 'Modules/screensChoices/actions';

function screensChoices(state = {}, action) {
    switch (action.type) {
        case ADD_SCREEN_CHOICE: {
            return {
                ...state,
                [action.payload.screenChoice.id]: action.payload.screenChoice,
            };
        }

        case EDIT_SCREEN_CHOICE_LABEL: {
            const newScreenChoice = state[action.payload.screenChoiceId].clone();
            newScreenChoice.label = action.payload.newLabel;

            return {
                ...state,
                [action.payload.screenChoiceId]: newScreenChoice,
            };
        }

        case EDIT_SCREEN_CHOICE_TARGET: {
            const newScreenChoice = state[action.payload.screenChoiceId].clone();
            newScreenChoice.targetScreenId = action.payload.newTargetId;

            return {
                ...state,
                [action.payload.screenChoiceId]: newScreenChoice,
            };
        }

        default:
            return state;
    }
}

export default screensChoices;
