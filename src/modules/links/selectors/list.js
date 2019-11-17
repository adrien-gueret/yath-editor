import selectors from 'Modules/screens/selectors';

function get(state) {
    return state.links.list;
}

function getByIds(state, linkIds = []) {
    const links = get(state);
    return linkIds.map(linkId => links[linkId]).filter(link => !!link);
}

function getByScreenId(state, screenId) {
    const screen = selectors.list.getById(state, screenId);
    return getByIds(state, screen ? screen.linkIds : []);
}

export default {
    get,
    getByIds,
    getByScreenId,
};