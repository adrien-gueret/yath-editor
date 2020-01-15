import actionTypes from './types';

export default {
    testGame(startScreenId) {
        return { type: actionTypes.TEST_GAME, payload: { startScreenId } };
    },
    finishTestGame() {
        return { type: actionTypes.FINISH_TEST_GAME };
    },
};