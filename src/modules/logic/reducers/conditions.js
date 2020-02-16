import ConditionModel from '../models/Condition';

import actionTypes from '../actions/types';

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

        default:
            return state;
    }
}
