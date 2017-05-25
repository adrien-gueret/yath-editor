import Screen from 'Modules/screens/models/Screen';
import {
    ADD_SCREEN,
    EDIT_SCREEN_NAME,
    EDIT_SCREEN_CONTENT,
    ADD_SCREEN_ACTION,
    EDTION_SCREEN_ACTION_LABEL,
    EDTION_SCREEN_ACTION_TARGET,
} from 'Modules/screens/actions';

const INITIAL_STATE = {
    screens: [ new Screen('First screen', 'First screen content') ],
};

function appReducer(state = INITIAL_STATE, action) {
    let screens;

    switch (action.type) {
        case ADD_SCREEN:
            screens = [ ...state.screens, action.payload.screen ];
            return { screens };

        case EDIT_SCREEN_NAME: {
            let newName = action.payload.newName;
            let alreadyExisted = false;

            do {
                const newSlug = new Screen(newName).getSlug();

                const screensWithSameSlugs = state.screens.filter(screen => screen.getSlug() === newSlug);
                alreadyExisted = screensWithSameSlugs.length > 0;

                if (alreadyExisted) {
                    newName += '_2';
                }
            } while(alreadyExisted);

            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.equals(action.payload.screen)) {
                    copiedScreen.name = newName;
                }

                return copiedScreen;
            });

            return { screens };
        }

        case EDIT_SCREEN_CONTENT: {
            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.equals(action.payload.screen)) {
                    copiedScreen.content = action.payload.newContent;
                }

                return copiedScreen;
            });

            return { screens };
        }

        case ADD_SCREEN_ACTION: {
            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.equals(action.payload.screen)) {
                    copiedScreen.actions.push(action.payload.screenAction);
                }

                return copiedScreen;
            });

            return { screens };
        }

        case EDTION_SCREEN_ACTION_LABEL: {
            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.equals(action.payload.screen)) {
                    const screenActions = copiedScreen.actions.map(screenAction => {
                        const copiedAction = screenAction.clone();

                        if (copiedAction.equals(action.payload.screenAction)) {
                            copiedAction.label = action.payload.newLabel;
                        }

                        return copiedAction;
                    });

                    copiedScreen.actions = screenActions;
                }

                return copiedScreen;
            });

            return { screens };
        }

        case EDTION_SCREEN_ACTION_TARGET: {
            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.equals(action.payload.screen)) {
                    const screenActions = copiedScreen.actions.map(screenAction => {
                        const copiedAction = screenAction.clone();

                        if (copiedAction.equals(action.payload.screenAction)) {
                            copiedAction.targetScreen = action.payload.newTarget;
                        }

                        return copiedAction;
                    });

                    copiedScreen.actions = screenActions;
                }

                return copiedScreen;
            });

            return { screens };
        }

        default:
            return state;
    }
}

export default appReducer;
