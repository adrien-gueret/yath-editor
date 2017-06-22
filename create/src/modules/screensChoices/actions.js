export const ADD_SCREEN_CHOICE = 'ADD_SCREEN_CHOICE';
export const DELETE_SCREEN_CHOICE = 'DELETE_SCREEN_CHOICE';
export const EDIT_SCREEN_CHOICE_LABEL = 'EDIT_SCREEN_CHOICE_LABEL';
export const EDIT_SCREEN_CHOICE_TARGET = 'EDIT_SCREEN_CHOICE_TARGET';
export const LOAD_SCREENS_CHOICES = 'LOAD_SCREENS_CHOICES';

export function addScreenChoice(screenId, screenChoice) {
    return { type: ADD_SCREEN_CHOICE, payload: { screenId, screenChoice } };
}

export function deleteScreenChoice(screenChoiceId) {
    return { type: DELETE_SCREEN_CHOICE, payload: { screenChoiceId } };
}

export function editScreenChoiceLabel(screenChoiceId, newLabel) {
    return { type: EDIT_SCREEN_CHOICE_LABEL, payload: { screenChoiceId, newLabel } };
}

export function editScreenChoiceTarget(screenChoiceId, newTargetId) {
    return { type: EDIT_SCREEN_CHOICE_TARGET, payload: { screenChoiceId, newTargetId } };
}

export function loadScreensChoices(screensChoicesData) {
    return { type: LOAD_SCREENS_CHOICES, payload: { screensChoicesData } };
}