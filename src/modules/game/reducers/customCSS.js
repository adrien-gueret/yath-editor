import actionTypes from '../actions/types';

export default function customCSS(state = '', action) {
    switch(action.type) {
        case actionTypes.SET_CUSTOM_CSS:
            return action.payload.css;

        default:
            return state;
    }
}