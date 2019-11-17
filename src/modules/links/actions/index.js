import actionTypes from './types';

export default {
    addLink(screenId, link) {
        return { type: actionTypes.ADD_LINK, payload: { screenId, link } };
    },
    deleteLink(linkId) {
        return { type: actionTypes.DELETE_LINK, payload: { linkId } };
    },
    deleteAllLinks() {
        return { type: actionTypes.DELETE_ALL_LINKS };
    },
    editLinkLabel(linkId, newLabel) {
        return { type: actionTypes.EDIT_LINK_LABEL, payload: { linkId, newLabel } };
    },
    editLinkTarget(linkId, newTargetId) {
        return { type: actionTypes.EDIT_LINK_TARGET, payload: { linkId, newTargetId } };
    },
    loadLinks(linksData) {
        return { type: actionTypes.LOAD_LINKS, payload: { linksData } };
    },
};