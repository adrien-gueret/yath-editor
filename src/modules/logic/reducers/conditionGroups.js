import ConditionGroupModel from '../models/ConditionGroup';

import actionTypes from '../actions/types';

const INITIAL_STATE = {};

export default function conditionGroups(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.ADD_CONDITION_GROUP:
            return {
                ...state,
                [action.payload.conditionGroup.id]: action.payload.conditionGroup,
            };

        case actionTypes.DELETE_CONDITION_GROUPS: {
            return action.payload.conditionGroupIds.reduce((newConditionGroups, conditionGroupIdToDelete) => ({
                ...newConditionGroups,
                [conditionGroupIdToDelete]: undefined,
            }), state);
        }

        case actionTypes.ADD_CONDITION: {
            const conditionGroup = state[action.payload.conditionGroupId].clone();
            conditionGroup.conditionIds.push(action.payload.condition.id);

            return {
                ...state,
                [action.payload.conditionGroupId]: conditionGroup,
            };
        }

        case actionTypes.DELETE_CONDITION: {
            return Object.keys(state).reduce((allConditionGroups, conditionGroupId) => {
                const clone = state[conditionGroupId].clone();
                clone.conditionIds = clone.conditionIds
                    .filter(conditionId => conditionId !== action.payload.conditionId);

                return {
                    ...allConditionGroups,
                    [conditionGroupId]: clone,
                };
            }, {});
        }

        case actionTypes.DELETE_ALL_LOGIC: {
            return {};
        }

        case actionTypes.LOAD_LOGIC: {
            const { conditionGroups } = action.payload.logicData || {};
            return Object.keys(conditionGroups || {})
                    .map(conditionGroupId => ConditionGroupModel.createFromJSON({
                        ...conditionGroups[conditionGroupId],
                        id: conditionGroupId,
                    }))
                    .reduce((newState, conditionGroup) => ({
                        ...newState,
                        [conditionGroup.id]: conditionGroup,
                    }), {});
        }

        default:
            return state;
    }
}
