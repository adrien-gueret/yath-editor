import actionTypes from '../actions/types';
import ItemModel from '../models/Item';

export default function items(state = {}, action) {
    switch (action.type) {
        case actionTypes.ADD_ITEM: {
            const { item } = action.payload;

            const nameAlreadyExisted = Object.keys(state).some((itemId) => state[itemId].name === item.name);

            if (nameAlreadyExisted) {
                return state;
            }

            return {
                ...state,
                [item.id]: item,
            };
        }

        case actionTypes.DELETE_ITEM: {
            const itemToDelete = state[action.payload.itemId];

            if (!itemToDelete) {
                return state;
            }

            const newItems = { ...state };
            delete newItems[itemToDelete.id];

            return newItems;
        }

        case actionTypes.DELETE_ALL_ITEMS: {
            return {};
        }

        case actionTypes.LOAD_INVENTORY: {
            const { inventoryData = {} } = action.payload;
            const { items = {} } = inventoryData;

            return Object.keys(items)
                    .map(itemId => ItemModel.createFromJSON({
                        ...items[itemId],
                        id: itemId,
                    }))
                    .reduce((newState, item) => ({
                        ...newState,
                        [item.id]: item,
                    }), {});
        }

        default:
            return state;
    }
}
