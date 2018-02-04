import choicesSelectors from 'Modules/screensChoices/selectors';

function get(state) {
    return state.screens;
}

function getAsArray(state) {
    const allScreens = get(state);
    return Object.keys(allScreens).map(screenId => allScreens[screenId]);
}

function getById(state, screenId) {
    const screens = get(state);
    return screens[screenId] || null;
}

function getAllExceptOne(state, screenId) {
    return getAsArray(state).filter(screen => screen.id !== screenId);
}

function hasChoiceWithoutTarget(state, screenId) {
    const screen = getById(state, screenId);

    if (!screen) {
        return false;
    }

    const choices = choicesSelectors.getByIds(state, screen.choicesIds);
    return choices.some(choice => !choice.targetScreenId);
}

function getStart(state) {
    const screens = getAsArray(state);
    const startScreen = screens.filter(screen => screen.isStart);
    return startScreen[0] || null;
}


export default {
    get,
    getAsArray,
    getAllExceptOne,
    getById,
    hasChoiceWithoutTarget,
    getStart,
};