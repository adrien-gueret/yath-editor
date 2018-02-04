function getEditScreenId(state) {
    return state.editScreenId;
}

function isGameTesting(state) {
    return state.gameTesting;
}

function getExportableState(state) {
    const { screens, screensChoices } = { ...state };
    return { screens, screensChoices};
}

export default {
    getEditScreenId,
    getExportableState,
    isGameTesting,
};