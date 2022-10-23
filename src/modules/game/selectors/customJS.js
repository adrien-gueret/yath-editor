import { INITIAL_STATE } from '../reducers/customJS';

function get(state) {
    return state.game.customJS;
}

function getExportable(state) {
    const customJS = get(state);
    return customJS === INITIAL_STATE ? '' : customJS;
}

export default {
    get,
    getExportable,
}