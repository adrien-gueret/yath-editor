import actionTypes from './types';

export default {
    testGame(startScreenId) {
        return { type: actionTypes.TEST_GAME, payload: { startScreenId } };
    },
    finishTestGame() {
        return { type: actionTypes.FINISH_TEST_GAME };
    },
    renameGame(name) {
        return { type: actionTypes.RENAME_GAME, payload: { name } };
    },
    downloadGame() {
        return { type: actionTypes.DOWNLOAD_GAME };
    },
    setCustomCSS(css) {
        return { type: actionTypes.SET_CUSTOM_CSS, payload: { css } };
    },
    configureGame() {
        return { type: actionTypes.CONFIGURE_GAME };
    },
    finishConfigureGame() {
        return { type: actionTypes.FINISH_CONFIGURE_GAME };
    },
};