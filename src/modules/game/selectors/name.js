function get(state) {
    const name = state.game.name;
    return name.trim() || 'My yath game';
}

function getEditable(state) {
    return state.game.name;
}

export default {
    get,
    getEditable,
}