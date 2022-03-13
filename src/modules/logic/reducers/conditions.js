import { actionTypes as screenActionTypes } from 'Modules/screens';

import ConditionModel from '../models/Condition';

import actionTypes from '../actions/types';
import conditionSubjectToValueType from '../constants/conditionSubjectToValueType';

const INITIAL_STATE = {};

export default function conditions(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.ADD_CONDITION:
            return {
                ...state,
                [action.payload.condition.id]: action.payload.condition,
            };


        case actionTypes.DELETE_CONDITIONS: {
            return action.payload.conditionIds.reduce((acc, conditionIdToDelete) => {
                const newConditions = { ...acc };
                delete newConditions[conditionIdToDelete];

                return newConditions;
            }, state);
        }

        case actionTypes.DELETE_ALL_LOGIC: {
            return {};
        }

        case actionTypes.UPDATE_CONDITION_SUBJECT: {
            const newCondition = state[action.payload.conditionId].clone();

            const prevConditionToValueType = conditionSubjectToValueType[newCondition.subject];
            const newConditionToValueType = conditionSubjectToValueType[action.payload.conditionSubject];

            newCondition.subject = action.payload.conditionSubject;

            if (prevConditionToValueType !== newConditionToValueType) {
                switch(newConditionToValueType) {
                    case 'screen':
                        newCondition.params = { screenId: null };
                    break;
    
                    case 'item':
                        newCondition.params = { itemId: null, operator: '>=', total: 1 };
                    break;
                }
            }

            return {
                ...state,
                [action.payload.conditionId]: newCondition,
            };
        }

        case actionTypes.UPDATE_CONDITION_PARAMS: {
            const newCondition = state[action.payload.conditionId].clone();

            newCondition.params = { ...action.payload.conditionParams };

            return {
                ...state,
                [action.payload.conditionId]: newCondition,
            };
        }

        case actionTypes.LOAD_LOGIC: {
            const { conditions } = action.payload.logicData || {};
            return Object.keys(conditions || {})
                    .map(conditionId => ConditionModel.createFromJSON({
                        ...conditions[conditionId],
                        id: conditionId,
                    }))
                    .reduce((newState, condition) => ({
                        ...newState,
                        [condition.id]: condition,
                    }), {});
        }

        case screenActionTypes.DELETE_SCREEN: {
            const { screenId } = action.payload;

            return Object.keys(state).reduce((acc, conditionId) => {
                const newCondition = state[conditionId].clone();
                const type = conditionSubjectToValueType[newCondition.subject];
               
                if (type === 'screen' && newCondition.params.screenId === screenId) {
                    newCondition.params.screenId = null;
                }

                return {...acc, [conditionId]: newCondition };
            }, {});
        }

        default:
            return state;
    }
}
