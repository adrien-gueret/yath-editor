import {
    PLAYER_HAS_VISITED, PLAYER_HAS_NOT_VISITED, INVENTORY_CONTAINS, INVENTORY_DOES_NOT_CONTAIN,
} from './conditionSubjects';

export default {
    [PLAYER_HAS_VISITED]: 'screen',
    [PLAYER_HAS_NOT_VISITED]: 'screen',
    [INVENTORY_CONTAINS]: 'item',
    [INVENTORY_DOES_NOT_CONTAIN]: 'item',
};