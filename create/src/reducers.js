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
            const newSlug = new Screen(action.newName).getSlug();

            const screensWithSameSlugs = state.screens.filter(screen => screen.getSlug() === newSlug);
            const alreadyExisted = screensWithSameSlugs.length > 0;

            const suffixName = alreadyExisted ? '_2' : '';
            // FIXME: this dupplicatas checking does not work well :(

            screens = [ ...state.screens ].map(screen => {
                if (screen.getSlug() === currentSlug) {
                    screen.name = action.newName + suffixName;
                }

                return screen;
            });

            return { screens };
        break;

        default:
            return state;
    }
}

export default appReducer;