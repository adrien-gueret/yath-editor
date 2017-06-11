import {
    ADD_SCREEN_CHOICE,
    DELETE_SCREEN_CHOICE,
    EDIT_SCREEN_CHOICE_LABEL,
    EDIT_SCREEN_CHOICE_TARGET,
} from 'Modules/screensChoices/actions';

import {
    DELETE_SCREEN,
} from 'Modules/screens/actions';

function screensChoices(state = {}, action) {
    switch (action.type) {
        case ADD_SCREEN_CHOICE: {
            return {
                ...state,
                [action.payload.screenChoice.id]: action.payload.screenChoice,
            };
        }

        case DELETE_SCREEN_CHOICE: {
            const screenChoiceToDelete = state[action.payload.screenChoiceId];

            if (!screenChoiceToDelete) {
                return state;
            }

            const newScreensChoices = { ...state };
            delete newScreensChoices[screenChoiceToDelete.id];

            return newScreensChoices;
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

        case DELETE_SCREEN: {
            const screenId = action.payload.screenId;

            return Object.keys(state).reduce((allChoices, choiceId) => {
                const choice = state[choiceId].clone();
                choice.targetScreenId = choice.targetScreenId === screenId ? null : choice.targetScreenId;

                return {
                    ...allChoices,
                    [choiceId]: choice,
                };
            }, {});
        }

        default:
            return state;
    }
}

export default screensChoices;
