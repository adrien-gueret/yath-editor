import ResultModel from '../models/Result';

import actionTypes from '../actions/types';

const INITIAL_STATE = {};

export default function results(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.ADD_RESULT:
            return {
                ...state,
                [action.payload.result.id]: action.payload.result,
            };

        case actionTypes.DELETE_RESULTS: {
            return action.payload.resultIds.reduce((newResults, resultIdToDelete) => ({
                ...newResults,
                [resultIdToDelete]: undefined,
            }), state);
        }

        case actionTypes.UPDATE_RESULT_TYPE: {
            const newResult = state[action.payload.resultId].clone();

            newResult.type = action.payload.resultType;

            return {
                ...state,
                [action.payload.resultId]: newResult,
            };
        }

        case actionTypes.UPDATE_RESULT_PARAMS: {
            const newResult = state[action.payload.resultId].clone();

            newResult.params = [...action.payload.resultParams];

            return {
                ...state,
                [action.payload.resultId]: newResult,
            };
        }

        case actionTypes.DELETE_ALL_LOGIC: {
            return {};
        }

        case actionTypes.LOAD_LOGIC: {
            const { results = {} } = action.payload.logicData || {};
            return Object.keys(results)
                    .map(resultId => ResultModel.createFromJSON({
                        ...results[resultId],
                        id: resultId,
                    }))
                    .reduce((newState, result) => ({
                        ...newState,
                        [result.id]: result,
                    }), {});
        }

        default:
            return state;
    }
}
