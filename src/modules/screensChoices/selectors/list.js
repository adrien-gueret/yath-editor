import selectors from 'Modules/screens/selectors';

function get(state) {
    return state.screensChoices.list;
}

function getByIds(state, choicesIds = []) {
    const screensChoices = get(state);
    return choicesIds.map(choiceId => screensChoices[choiceId]).filter(choice => !!choice);
}

function getByScreenId(state, screenId) {
    const screen = selectors.list.getById(state, screenId);
    return getByIds(state, screen ? screen.choicesIds : []);
}

export default {
    get,
    getByIds,
    getByScreenId,
};