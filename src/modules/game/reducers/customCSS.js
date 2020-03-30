import actionTypes from '../actions/types';

export const INITIAL_STATE = `html, body {
    /* ... */
}

.yathScreen {
    /* ... */
}

.yathScreen--visible {
    /* ... */
}

.yathImage {
    /* ... */
}

.yathScreen nav button {
    /* ... */
}

.yathScreen nav button:hover {
    /* ... */
}

.yathScreen nav button:active {
    /* ... */
}`;

export default function customCSS(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.SET_CUSTOM_CSS:
            return action.payload.css;

        default:
            return state;
    }
}