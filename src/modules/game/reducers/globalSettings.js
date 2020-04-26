import actionTypes from '../actions/types';

export const INITIAL_STATE = {
    description: '',
    author: '',
    favicon: '',
    thumbnail: '',
};

export default function globalSettings(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.SET_GAME_DESCRIPTION:
            return {
                ...state,
                description: action.payload.description,
            };

        case actionTypes.SET_AUTHOR:
            return {
                ...state,
                author: action.payload.author,
            };

        case actionTypes.SET_FAVICON:
            return {
                ...state,
                favicon: action.payload.favicon,
            };

        case actionTypes.SET_THUMBNAIL:
            return {
                ...state,
                thumbnail: action.payload.thumbnail,
            };

        case actionTypes.SET_GLOBAL_SETTINGS:
            return action.payload.settings;

        default:
            return state;
    }
}