import RuleModel from '../models/Rule';

import actionTypes from '../actions/types';

const INITIAL_STATE = {};

export default function rules(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.ADD_RULE:
            return {
                ...state,
                [action.payload.rule.id]: action.payload.rule,
            };

        case actionTypes.DELETE_RULES: {
            return action.payload.ruleIds.reduce((newRules, ruleIdToDelete) => ({
                ...newRules,
                [ruleIdToDelete]: undefined,
            }), state);
        }

        case actionTypes.ADD_CONDITION_GROUP: {
            const newRule = state[action.payload.ruleId].clone();
            newRule.conditionGroupIds.push(action.payload.conditionGroup.id);

            return {
                ...state,
                [action.payload.ruleId]: newRule,
            };
        }

        case actionTypes.DELETE_CONDITION_GROUP: {
            return Object.keys(state).reduce((allRules, ruleId) => {
                const clone = state[ruleId].clone();
                clone.conditionGroupIds = clone.conditionGroupIds
                    .filter(conditionGroupId => conditionGroupId !== action.payload.conditionGroupId);

                return {
                    ...allRules,
                    [ruleId]: clone,
                };
            }, {});
        }

        case actionTypes.ADD_RESULT: {
            const newRule = state[action.payload.ruleId].clone();
            newRule.resultIds.push(action.payload.result.id);

            return {
                ...state,
                [action.payload.ruleId]: newRule,
            };
        }

        case actionTypes.DELETE_RESULT: {
            return Object.keys(state).reduce((allRules, ruleId) => {
                const clone = state[ruleId].clone();
                clone.resultIds = clone.resultIds
                    .filter(resultId => resultId !== action.payload.resultId);

                return {
                    ...allRules,
                    [ruleId]: clone,
                };
            }, {});
        }

        case actionTypes.DELETE_ALL_LOGIC: {
            return {};
        }

        case actionTypes.LOAD_LOGIC: {
            const { rules } = action.payload.logicData || {};
            return Object.keys(rules || {})
                    .map(ruleId => RuleModel.createFromJSON({
                        ...rules[ruleId],
                        id: ruleId,
                    }))
                    .reduce((newState, rule) => ({
                        ...newState,
                        [rule.id]: rule,
                    }), {});
        }

        default:
            return state;
    }
}
