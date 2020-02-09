import ScreenModel from '../models/Screen';

import actionTypes from '../actions/types';

import { actionTypes as linkActionTypes } from 'Modules/links';
import { actionTypes as logicActionTypes } from 'Modules/logic';

const startScreen = new ScreenModel('Start screen', 'Welcome to the <b>first screen</b> of your story!', true);

const INITIAL_STATE = {
    [startScreen.id]: startScreen,
};

export default function list(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.ADD_SCREEN:
            return {
                ...state,
                [action.payload.screen.id]: action.payload.screen,
            };

        case actionTypes.DELETE_SCREEN: {
            const screenToDelete = state[action.payload.screenId];

            if (!screenToDelete) {
                return state;
            }

            const newScreens = { ...state };
            delete newScreens[screenToDelete.id];

            return newScreens;
        }

        case actionTypes.DELETE_ALL_SCREENS: {
            return {};
        }

        case actionTypes.EDIT_SCREEN_NAME: {
            let newName = action.payload.newName;
            let alreadyExisted = false;

            do {
                const newSlug = new ScreenModel(newName, '', 1).getSlug();
                alreadyExisted = Object.keys(state).some(screenId => state[screenId].getSlug() === newSlug);

                if (alreadyExisted) {
                    newName += '_2';
                }
            } while(alreadyExisted);

            const newScreen = state[action.payload.screenId].clone();
            newScreen.name = newName;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.EDIT_SCREEN_CONTENT: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.content = action.payload.newContent === '<p></p>' ? '' : action.payload.newContent;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.SET_START_SCREEN: {
            return Object.keys(state)
                .reduce((newState, screenId) => {
                    const clonedScreen = state[screenId].clone();
                    clonedScreen.isStart = clonedScreen.id === action.payload.screenId;

                    return {
                        ...newState,
                        [clonedScreen.id]: clonedScreen,
                    };
                }, {});
        }

        case actionTypes.MOVE_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();

            newScreen.x = Math.max(0, action.payload.newX);
            newScreen.y = Math.max(0, action.payload.newY);

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.SELECT_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();

            newScreen.isSelected = true;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.UNSELECT_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();

            newScreen.isSelected = false;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.RESIZE_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.width = action.payload.newWidth;
            newScreen.height = action.payload.newHeight;

            if (action.payload.newX !== null) {
                newScreen.x = action.payload.newX;
            }

            if (action.payload.newY !== null) {
                newScreen.y = action.payload.newY;
            }


            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.LOAD_SCREENS: {
            return Object.keys(action.payload.screensData.list)
                    .map(screenId => ScreenModel.createFromJSON({
                        ...action.payload.screensData.list[screenId],
                        id: screenId,
                    }))
                    .reduce((newState, screen) => ({
                        ...newState,
                        [screen.id]: screen,
                    }), {});
        }

        case linkActionTypes.ADD_LINK: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.linkIds.push(action.payload.link.id);

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case linkActionTypes.DELETE_LINK: {
            return Object.keys(state).reduce((allScreens, screenId) => {
                const clone = state[screenId].clone();
                clone.linkIds = clone.linkIds.filter(linkId => linkId !== action.payload.linkId);

                return {
                    ...allScreens,
                    [screenId]: clone,
                };
            }, {});
        }

        case logicActionTypes.ADD_RULE: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.logicRuleIds.push(action.payload.rule.id);

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case logicActionTypes.DELETE_RULE: {
            return Object.keys(state).reduce((allScreens, screenId) => {
                const clone = state[screenId].clone();
                clone.logicRuleIds = clone.logicRuleIds.filter(ruleId => ruleId !== action.payload.ruleId);

                return {
                    ...allScreens,
                    [screenId]: clone,
                };
            }, {});
        }

        default:
            return state;
    }
}
