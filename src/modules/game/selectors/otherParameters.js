function get(state) {
    return state.game.otherParameters;
}

function getGoogleAnalyticsId(state) {
    const otherParameters = get(state);
    return otherParameters.gaId;
}

export default {
    get,
    getGoogleAnalyticsId,
}