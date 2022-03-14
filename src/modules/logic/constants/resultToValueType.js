import {
    REDIRECT, ADD_ITEM, REMOVE_ITEM, SWITCH_SCREEN_CONTENT, HIDE_LINK,
} from './results';

export default {
    [REDIRECT]: 'screen',
    [ADD_ITEM]: 'item',
    [REMOVE_ITEM]: 'item',
    [SWITCH_SCREEN_CONTENT]: 'screenContent',
    [HIDE_LINK]: 'link',
};