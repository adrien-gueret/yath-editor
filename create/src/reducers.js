import Screen from 'Modules/screens/models/Screen';
import { ADD_SCREEN, EDIT_SCREEN_NAME } from 'Modules/screens/actions';

const INITIAL_STATE = {
    screens: [ new Screen('First screen') ],
};

function appReducer(state = INITIAL_STATE, action) {
    let screens;

    switch (action.type) {
        case ADD_SCREEN:
            screens = [ ...state.screens, action.screen ];
            return { screens };
        break;

        case EDIT_SCREEN_NAME:
            const currentSlug = action.screen.getSlug();

            let newName = action.newName;
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
        break;

        default:
            return state;
    }
}

export default appReducer;