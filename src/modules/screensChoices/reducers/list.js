import { actionTypes as screenActionTypes } from 'Modules/screens';

import actionTypes from '../actions/types';
import ScreenChoiceModel from '../models/ScreenChoice';

export default function list(state = {}, action) {
    switch (action.type) {
        case actionTypes.ADD_SCREEN_CHOICE: {
            return {
                ...state,
                [action.payload.screenChoice.id]: action.payload.screenChoice,
            };
        }

        case actionTypes.DELETE_SCREEN_CHOICE: {
            const screenChoiceToDelete = state[action.payload.screenChoiceId];

            if (!screenChoiceToDelete) {
                return state;
            }

            const newScreensChoices = { ...state };
            delete newScreensChoices[screenChoiceToDelete.id];

            return newScreensChoices;
        }

        case actionTypes.DELETE_ALL_SCREEN_CHOICES: {
            return {};
        }

        case actionTypes.EDIT_SCREEN_CHOICE_LABEL: {
            const newScreenChoice = state[action.payload.screenChoiceId].clone();
            newScreenChoice.label = action.payload.newLabel;

            return {
                ...state,
                [action.payload.screenChoiceId]: newScreenChoice,
            };
        }

        case actionTypes.EDIT_SCREEN_CHOICE_TARGET: {
            const newScreenChoice = state[action.payload.screenChoiceId].clone();
            newScreenChoice.targetScreenId = action.payload.newTargetId;

            return {
                ...state,
                [action.payload.screenChoiceId]: newScreenChoice,
            };
        }

        case actionTypes.LOAD_SCREENS_CHOICES: {
            return Object.keys(action.payload.screensChoicesData.list)
                .map(screenChoiceId => {
                    const {label, targetScreenId} = action.payload.screensChoicesData.list[screenChoiceId];
                    return new ScreenChoiceModel(label, targetScreenId, screenChoiceId);
                })
                .reduce((newState, screenChoice) => ({
                    ...newState,
                    [screenChoice.id]: screenChoice,
                }), {});
        }

        case screenActionTypes.DELETE_SCREEN: {
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
