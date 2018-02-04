function get(state) {
    return state.screensChoices;
}

function getByIds(state, choicesIds) {
    const screensChoices = get(state);
    return choicesIds.map(choiceId => screensChoices[choiceId]).filter(choice => !!choice);
}

export default {
    get,
    getByIds,
};