function get(state) {
    return state.inventory.items;
}

function getAsArray(state) {
    const allItems = get(state);
    return Object.keys(allItems).map(itemId => allItems[itemId]);
}

export default {
    get,
    getAsArray,
};