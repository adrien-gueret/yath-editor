import actionTypes from '../actions/types';

const INITIAL_STATE = {
    isConfiguring: false,
    defaultTab: 'css',
};

export default function isConfiguring(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.CONFIGURE_GAME:
            return {
                isConfiguring: true,
                defaultTab: action.payload.defaultTab,
            };

        case actionTypes.FINISH_CONFIGURE_GAME:
            return {
                ...state,
                isConfiguring: false,
            };

        case actionTypes.SET_CONFIGURATION_TAB:
            return {
                ...state,
                defaultTab: action.payload.tab,
            };

        default:
            return state;
    }
}