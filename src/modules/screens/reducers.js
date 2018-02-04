import Screen from 'Modules/screens/models/Screen';
import {
    ADD_SCREEN,
    DELETE_SCREEN,
    DELETE_ALL_SCREENS,
    EDIT_SCREEN_NAME,
    EDIT_SCREEN_CONTENT,
    SET_START_SCREEN,
    LOAD_SCREENS,
    MOVE_SCREEN,
    RESIZE_SCREEN,
} from 'Modules/screens/actions';

import {
    ADD_SCREEN_CHOICE,
} from 'Modules/screensChoices/actions';

const startScreen = new Screen('Start screen', '', true);
startScreen.x = 200;
startScreen.y = 200;

const INITIAL_STATE = {
    [startScreen.id]: startScreen,
};

function screens(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADD_SCREEN:
            return {
                ...state,
                [action.payload.screen.id]: action.payload.screen,
            };

        case DELETE_SCREEN: {
            const screenToDelete = state[action.payload.screenId];

            if (!screenToDelete) {
                return state;
            }

            const newScreens = { ...state };
            delete newScreens[screenToDelete.id];

            return newScreens;
        }

        case DELETE_ALL_SCREENS: {
            return {};
        }

        case EDIT_SCREEN_NAME: {
            let newName = action.payload.newName;
            let alreadyExisted = false;

            do {
                const newSlug = new Screen(newName, '', 1).getSlug();
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

        case EDIT_SCREEN_CONTENT: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.content = action.payload.newContent;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case SET_START_SCREEN: {
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

        case ADD_SCREEN_CHOICE: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.choicesIds.push(action.payload.screenChoice.id);

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case MOVE_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.x = action.payload.newX;
            newScreen.y = action.payload.newY;

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case RESIZE_SCREEN: {
            const newScreen = state[action.payload.screenId].clone();
            newScreen.width = parseInt(action.payload.newWidth, 10);
            newScreen.height = parseInt(action.payload.newHeight, 10);

            return {
                ...state,
                [action.payload.screenId]: newScreen,
            };
        }

        case LOAD_SCREENS: {
            return Object.keys(action.payload.screensData)
                    .map(screenId => Screen.createFromJSON(action.payload.screensData[screenId]))
                    .reduce((newState, screen) => ({
                        ...newState,
                        [screen.id]: screen,
                    }), {});
        }

        default:
            return state;
    }
}

export default screens;
