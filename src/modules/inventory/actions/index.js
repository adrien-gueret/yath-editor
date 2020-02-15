import actionTypes from './types';

export default {
    addItem(item) {
        return { type: actionTypes.ADD_ITEM, payload: { item } };
    },
    deleteItem(itemId) {
        return { type: actionTypes.DELETE_ITEM, payload: { itemId } };
    },
    deleteAllItems() {
        return { type: actionTypes.DELETE_ALL_ITEMS };
    },
    loadInventory(inventoryData) {
        return { type: actionTypes.LOAD_INVENTORY, payload: { inventoryData } };
    },
};