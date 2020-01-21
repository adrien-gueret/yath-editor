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
};