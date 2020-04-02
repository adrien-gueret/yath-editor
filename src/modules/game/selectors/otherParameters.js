function get(state) {
    return state.game.otherParameters;
}

function getGoogleAnalyticsId(state) {
    const otherParameters = get(state);
    return otherParameters.gaId;
}

function getCloudinary(state) {
    const otherParameters = get(state);
    return otherParameters.cloudinary || {};
}

export default {
    get,
    getGoogleAnalyticsId,
    getCloudinary,
}