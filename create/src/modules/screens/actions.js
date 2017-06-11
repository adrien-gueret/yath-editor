export const ADD_SCREEN = 'ADD_SCREEN';
export const EDIT_SCREEN_NAME = 'EDIT_SCREEN_NAME';
export const EDIT_SCREEN_CONTENT = 'EDIT_SCREEN_CONTENT';
export const MOVE_SCREEN = 'MOVE_SCREEN';
export const RESIZE_SCREEN = 'RESIZE_SCREEN';
export const DELETE_SCREEN = 'DELETE_SCREEN';

export function addScreen(screen) {
    return { type: ADD_SCREEN, payload: { screen } };
}

export function editScreenName(screenId, newName) {
    return { type: EDIT_SCREEN_NAME, payload: { screenId, newName } };
}

export function editScreenContent(screenId, newContent) {
    return { type: EDIT_SCREEN_CONTENT, payload: { screenId, newContent } };
}

export function moveScreen(screenId, newX, newY) {
    return { type: MOVE_SCREEN, payload: { screenId, newX, newY } };
}

export function resizeScreen(screenId, newWidth, newHeight) {
    return { type: RESIZE_SCREEN, payload: { screenId, newWidth, newHeight } };
}

export function deleteScreen(screenId) {
    return { type: DELETE_SCREEN, payload: { screenId } };
}