import actionTypes from './types';

export default {
    addScreen(screen) {
        return { type: actionTypes.ADD_SCREEN, payload: { screen } };
    },
    editScreenName(screenId, newName) {
        return { type: actionTypes.EDIT_SCREEN_NAME, payload: { screenId, newName } };
    },
    editScreenContent(screenId, newContent) {
        return { type: actionTypes.EDIT_SCREEN_CONTENT, payload: { screenId, newContent } };
    },
    addAlternativeScreenContent(screenId) {
        return { type: actionTypes.ADD_ALTERNATIVE_SCREEN_CONTENT, payload: { screenId } };
    },
    editAlternativeScreenContent(screenId, contentId, newContent) {
        return { type: actionTypes.EDIT_ALTERNATIVE_SCREEN_CONTENT, payload: { screenId, newContent, contentId } };
    },
    deleteAlternativeScreenContent(screenId, contentId) {
        return { type: actionTypes.DELETE_ALTERNATIVE_SCREEN_CONTENT, payload: { screenId, contentId } };
    },
    editScreenImage(screenId, newImage) {
        return { type: actionTypes.EDIT_SCREEN_IMAGE, payload: { screenId, newImage } };
    },
    editScreenImageOrder(screenId, mustRenderAfterContent) {
        return { type: actionTypes.EDIT_SCREEN_IMAGE_ORDER, payload: { screenId, mustRenderAfterContent } };
    },
    setStartScreen(screenId) {
        return { type: actionTypes.SET_START_SCREEN, payload: { screenId } };
    },
    moveScreen(screenId, newX, newY, isDelta = false) {
        return { type: actionTypes.MOVE_SCREEN, payload: { screenId, newX, newY, isDelta } };
    },
    moveScreens(screenIds, deltaX, deltaY) {
        return { type: actionTypes.MOVE_SCREENS, payload: { screenIds, deltaX, deltaY } };
    },
    resizeScreen(screenId, newWidth, newHeight) {
        return { type: actionTypes.RESIZE_SCREEN, payload: { screenId, newWidth, newHeight } };
    },
    deleteScreen(screenId) {
        return { type: actionTypes.DELETE_SCREEN, payload: { screenId } };
    },
    deleteAllScreens() {
        return { type: actionTypes.DELETE_ALL_SCREENS };
    },
    loadScreens(screensData) {
        return { type: actionTypes.LOAD_SCREENS, payload: { screensData } };
    },
    setEditScreen(screenId) {
        return { type: actionTypes.SET_EDIT_SCREEN, payload: { screenId } };
    },
    unsetEditScreen() {
        return { type: actionTypes.UNSET_EDIT_SCREEN };
    },
    selectScreen(screenId) {
        return { type: actionTypes.SELECT_SCREEN, payload: { screenId } };
    },
    unselectScreen(screenId) {
        return { type: actionTypes.UNSELECT_SCREEN, payload: { screenId } };
    },
}