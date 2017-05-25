export const ADD_SCREEN = 'ADD_SCREEN';
export const EDIT_SCREEN_NAME = 'EDIT_SCREEN_NAME';
export const EDIT_SCREEN_CONTENT = 'EDIT_SCREEN_CONTENT';

export function addScreen(screen) {
    return { type: ADD_SCREEN, payload: { screen } };
}

export function editScreenName(screenId, newName) {
    return { type: EDIT_SCREEN_NAME, payload: { screenId, newName } };
}

export function editScreenContent(screenId, newContent) {
    return { type: EDIT_SCREEN_CONTENT, payload: { screenId, newContent } };
}