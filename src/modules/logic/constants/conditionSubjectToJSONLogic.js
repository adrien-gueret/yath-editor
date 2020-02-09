import {
    PLAYER_HAS_VISITED, PLAYER_HAS_NOT_VISITED, INVENTORY_CONTAINS, INVENTORY_DOES_NOT_CONTAIN,
} from './conditionSubjects';

export default {
    [PLAYER_HAS_VISITED]: {
        method: 'hasVisitedScreen',
        valueToCheck: true,
    },
    [PLAYER_HAS_NOT_VISITED]: {
        method: 'hasVisitedScreen',
        valueToCheck: false,
    },
    [INVENTORY_CONTAINS]: {
        method: 'inventory.hasItem',
        valueToCheck: true,
    },
    [INVENTORY_DOES_NOT_CONTAIN]:  {
        method: 'inventory.hasItem',
        valueToCheck: false,
    },
};