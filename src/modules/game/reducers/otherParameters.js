import actionTypes from '../actions/types';

export const INITIAL_STATE = {
    gaId: undefined,
    cloudinary: {
        name: undefined,
        preset: undefined,
    },
};

export default function otherParameters(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.SET_GOOGLE_ANALYTICS_ID:
            return {
                ...state,
                gaId: action.payload.gaId || undefined,
            };

        case actionTypes.SET_CLOUDINARY_NAME:
            return {
                ...state,
                cloudinary: {
                    ...state.cloudinary,
                    name: action.payload.name || undefined,
                },
            };

        case actionTypes.SET_CLOUDINARY_PRESET:
            return {
                ...state,
                cloudinary: {
                    ...state.cloudinary,
                    preset: action.payload.preset || undefined,
                },
            };

        case actionTypes.SET_OTHER_PARAMETERS:
            return action.payload.parameters;

        default:
            return state;
    }
}