export const ADD_SCREEN = 'ADD_SCREEN';
export const EDIT_SCREEN_NAME = 'EDIT_SCREEN_NAME';
export const EDIT_SCREEN_CONTENT = 'EDIT_SCREEN_CONTENT';

export function addScreen(screen) {
    return { type: ADD_SCREEN, screen };
}

export function editScreenName(screen, newName) {
    return { type: EDIT_SCREEN_NAME, screen, newName };
}

export function editScreenContent(screen, newContent) {
    return { type: EDIT_SCREEN_CONTENT, screen, newContent };
}