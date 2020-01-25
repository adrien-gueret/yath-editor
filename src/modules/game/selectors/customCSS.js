import { INITIAL_STATE } from '../reducers/customCSS';

function get(state) {
    return state.game.customCSS;
}

function getExportable(state) {
    const customCSS = get(state);
    return customCSS === INITIAL_STATE ? '' : customCSS;
}

export default {
    get,
    getExportable,
}