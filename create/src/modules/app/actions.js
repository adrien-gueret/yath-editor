export const SET_EDIT_SCREEN = 'SET_EDITED_SCREEN';
export const UNSET_EDIT_SCREEN = 'UNSET_EDIT_SCREEN';

export function setEditScreen(screenId) {
    return { type: SET_EDIT_SCREEN, payload: { screenId } };
}

export function unsetEditScreen() {
    return { type: UNSET_EDIT_SCREEN };
}