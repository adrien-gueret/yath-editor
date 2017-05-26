import Screen from 'Modules/screens/models/Screen';
import {
    ADD_SCREEN,
    EDIT_SCREEN_NAME,
    EDIT_SCREEN_CONTENT,
    MOVE_SCREEN,
} from 'Modules/screens/actions';

import {
    ADD_SCREEN_CHOICE,
} from 'Modules/screensChoices/actions';

const INITIAL_STATE = {
    1: new Screen('First screen', 'First screen content'),
};

function screens(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADD_SCREEN:
            return {
                ...state,
                [action.payload.screen.id]: action.payload.screen,
            };

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

        default:
            return state;
    }
}

export default screens;
