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
        break;

        case EDIT_SCREEN_NAME: {
            const currentSlug = action.payload.screen.getSlug();

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

                if (copiedScreen.getSlug() === currentSlug) {
                    copiedScreen.name = newName;
                }

                return copiedScreen;
            });

            return { screens };
        }
        break;

        case EDIT_SCREEN_CONTENT: {
            const currentSlug = action.payload.screen.getSlug();

            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.getSlug() === currentSlug) {
                    copiedScreen.content = action.payload.newContent;
                }

                return copiedScreen;
            });

            return { screens };
        }
        break;

        case ADD_SCREEN_ACTION: {
            const currentSlug = action.payload.screen.getSlug();

            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.getSlug() === currentSlug) {
                    copiedScreen.actions.push(action.payload.screenAction);
                }

                return copiedScreen;
            });

            return { screens };
        }
        break;

        case EDTION_SCREEN_ACTION_LABEL: {
            const currentSlug = action.payload.screen.getSlug();

            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.getSlug() === currentSlug) {
                    const screenActions = copiedScreen.actions.map(screenAction => {
                        const copiedAction = screenAction.clone();

                        if (copiedAction.id === action.payload.screenAction.id) {
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
            break;

        case EDTION_SCREEN_ACTION_TARGET: {
            const currentSlug = action.payload.screen.getSlug();

            screens = state.screens.map(screen => {
                const copiedScreen = screen.clone();

                if (copiedScreen.getSlug() === currentSlug) {
                    const screenActions = copiedScreen.actions.map(screenAction => {
                        const copiedAction = screenAction.clone();

                        if (copiedAction.id === action.payload.screenAction.id) {
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
            break;

        default:
            return state;
    }
}

export default appReducer;