export const ADD_SCREEN = 'ADD_SCREEN';
export const EDIT_SCREEN_NAME = 'EDIT_SCREEN_NAME';
export const EDIT_SCREEN_CONTENT = 'EDIT_SCREEN_CONTENT';
export const ADD_SCREEN_ACTION = 'ADD_SCREEN_ACTION';
export const EDTION_SCREEN_ACTION_LABEL = 'EDTION_SCREEN_ACTION_LABEL';
export const EDTION_SCREEN_ACTION_TARGET = 'EDTION_SCREEN_ACTION_TARGET';

export function addScreen(screen) {
    return { type: ADD_SCREEN, payload: { screen } };
}

export function editScreenName(screen, newName) {
    return { type: EDIT_SCREEN_NAME, payload: { screen, newName } };
}

export function editScreenContent(screen, newContent) {
    return { type: EDIT_SCREEN_CONTENT, payload: { screen, newContent } };
}

export function addScreenAction(screen, screenAction) {
    return { type: ADD_SCREEN_ACTION, payload: { screen, screenAction } };
}

export function editScreenActionLabel(screen, screenAction, newLabel) {
    return { type: EDTION_SCREEN_ACTION_LABEL, payload: { screen, screenAction, newLabel } };
}

export function editScreenActionTarget(screen, screenAction, newTarget) {
    return { type: EDTION_SCREEN_ACTION_TARGET, payload: { screen, screenAction, newTarget } };
}