import actionTypes from './types';

export default {
    testGame() {
        return { type: actionTypes.TEST_GAME };
    },
    finishTestGame() {
        return { type: actionTypes.FINISH_TEST_GAME };
    },
};