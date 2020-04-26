import { selectors as screenSelectors } from 'Modules/screens';

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
    const { thumbnail } = globalSettings;

    if (thumbnail) {
        return thumbnail;
    }


    return screenSelectors.list.getFirstImage(state);
}

export default {
    get,
    getAuthor,
    getDescription,
    getFavicon,
    getThumbnail,
}