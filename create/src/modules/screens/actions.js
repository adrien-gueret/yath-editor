export const ADD_SCREEN = 'ADD_SCREEN';
export const EDIT_SCREEN_NAME = 'EDIT_SCREEN_NAME';

export function addScreen(screen) {
    return { type: ADD_SCREEN, screen };
}

export function editScreenName(screen, newName) {
    return { type: EDIT_SCREEN_NAME, screen, newName };
}