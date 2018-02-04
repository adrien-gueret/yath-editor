export const SET_EDIT_SCREEN = 'SET_EDITED_SCREEN';
export const UNSET_EDIT_SCREEN = 'UNSET_EDIT_SCREEN';
export const TEST_GAME = 'TEST_GAME';
export const FINISH_TEST_GAME = 'FINISH_TEST_GAME';

export function setEditScreen(screenId) {
    return { type: SET_EDIT_SCREEN, payload: { screenId } };
}

export function unsetEditScreen() {
    return { type: UNSET_EDIT_SCREEN };
}

export function testGame() {
    return { type: TEST_GAME };
}

export function finishTestGame() {
    return { type: FINISH_TEST_GAME };
}