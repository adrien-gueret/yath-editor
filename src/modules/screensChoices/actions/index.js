import actionTypes from './types';

export default {
    addScreenChoice(screenId, screenChoice) {
        return { type: actionTypes.ADD_SCREEN_CHOICE, payload: { screenId, screenChoice } };
    },
    deleteScreenChoice(screenChoiceId) {
        return { type: actionTypes.DELETE_SCREEN_CHOICE, payload: { screenChoiceId } };
    },
    deleteAllScreenChoices() {
        return { type: actionTypes.DELETE_ALL_SCREEN_CHOICES };
    },
    editScreenChoiceLabel(screenChoiceId, newLabel) {
        return { type: actionTypes.EDIT_SCREEN_CHOICE_LABEL, payload: { screenChoiceId, newLabel } };
    },
    editScreenChoiceTarget(screenChoiceId, newTargetId) {
        return { type: actionTypes.EDIT_SCREEN_CHOICE_TARGET, payload: { screenChoiceId, newTargetId } };
    },
    loadScreensChoices(screensChoicesData) {
        return { type: actionTypes.LOAD_SCREENS_CHOICES, payload: { screensChoicesData } };
    },
};