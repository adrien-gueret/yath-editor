function get(state) {
    return state.game.isConfiguring;
}

function isConfiguring(state) {
    return get(state).isConfiguring;
}

function getDefaultTab(state) {
    return get(state).defaultTab;
}

export default {
    get,
    isConfiguring,
    getDefaultTab,
}