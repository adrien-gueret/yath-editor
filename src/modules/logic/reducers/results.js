import { actionTypes as screenActionTypes } from 'Modules/screens';

import ResultModel from '../models/Result';

import actionTypes from '../actions/types';
import resultToValueType from '../constants/resultToValueType';

const INITIAL_STATE = {};

export default function results(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.ADD_RESULT:
            return {
                ...state,
                [action.payload.result.id]: action.payload.result,
            };

        case actionTypes.DELETE_RESULTS: {
            return action.payload.resultIds.reduce((acc, resultIdToDelete) => {
                const newResults = { ...acc };
                delete newResults[resultIdToDelete];

                return newResults;
            }, state);
        }

        case actionTypes.UPDATE_RESULT_TYPE: {
            const newResult = state[action.payload.resultId].clone();

            const prevResultToValueType = resultToValueType[newResult.type];
            const newResultToValueType = resultToValueType[action.payload.resultType];

            newResult.type = action.payload.resultType;

            if (prevResultToValueType !== newResultToValueType) {
                switch(newResultToValueType) {
                    case 'screen':
                        newResult.params = { screenId: null };
                    break;
    
                    case 'item':
                        newResult.params = { itemId: null, total: 1 };
                    break;

                    case 'screenContent':
                        newResult.params = { alternativeContentId: null };
                    break;

                    default:
                        newResult.params = {};
                        break;
                }
            }

            return {
                ...state,
                [action.payload.resultId]: newResult,
            };
        }

        case actionTypes.UPDATE_RESULT_PARAMS: {
            const newResult = state[action.payload.resultId].clone();

            newResult.params = { ...action.payload.resultParams };

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

        case screenActionTypes.DELETE_SCREEN: {
            const { screenId } = action.payload;

            return Object.keys(state).reduce((acc, resultId) => {
                const newResult = state[resultId].clone();
                const valueType = resultToValueType[newResult.type];
               
                if (valueType === 'screen' && newResult.params.screenId === screenId) {
                    newResult.params.screenId = null;
                }

                return {...acc, [resultId]: newResult };
            }, {});
        }

        case screenActionTypes.DELETE_ALTERNATIVE_SCREEN_CONTENT: {
            const { contentId } = action.payload;
            
            return Object.keys(state).reduce((acc, resultId) => {
                const newResult = state[resultId].clone();
                const valueType = resultToValueType[newResult.type];
                
                if (valueType === 'screenContent' && newResult.params.alternativeContentId === contentId) {
                    newResult.params.alternativeContentId = null;
                }

                return {...acc, [resultId]: newResult };
            }, {});
        }

        default:
            return state;
    }
}
