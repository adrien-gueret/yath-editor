import ScreenModel from '../models/Screen';

import actionTypes from '../actions/types';

import { actionTypes as linkActionTypes } from 'Modules/links';

const startScreen = new ScreenModel('Start screen', '', true);
startScreen.x = 200;
startScreen.y = 200;

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
            newScreen.content = action.payload.newContent;

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

            if (action.hasCollisions) {
                newScreen.tempX = action.payload.newX;
                newScreen.tempY = action.payload.newY;
            } else {
                newScreen.x = action.payload.newX;
                newScreen.y = action.payload.newY;
                newScreen.tempX = null;
                newScreen.tempY = null;
            }

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.RESET_TEMP_COORDINATES: {
            const newScreen = state[action.payload.screenId].clone();

            newScreen.tempX = null;
            newScreen.tempY = null;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.RESIZE_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.width = parseInt(action.payload.newWidth, 10);
            newScreen.height = parseInt(action.payload.newHeight, 10);

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case actionTypes.LOAD_SCREENS: {
            return Object.keys(action.payload.screensData.list)
                    .map(screenId => ScreenModel.createFromJSON(action.payload.screensData.list[screenId]))
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

        default:
            return state;
    }
}
