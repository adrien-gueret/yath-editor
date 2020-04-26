function get(state) {
    return state.game.globalSettings;
}

function getAuthor(state) {
    const globalSettings = get(state);
    return globalSettings.author;
}

function getDescription(state) {
    const globalSettings = get(state);
    return globalSettings.description;
}

function getFavicon(state) {
    const globalSettings = get(state);
    return globalSettings.favicon;
}

function getThumbnail(state) {
    const globalSettings = get(state);
    return globalSettings.thumbnail;
}

export default {
    get,
    getAuthor,
    getDescription,
    getFavicon,
    getThumbnail,
}