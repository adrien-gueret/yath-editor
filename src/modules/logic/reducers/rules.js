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
            return action.payload.ruleIds.reduce((acc, ruleIdToDelete) => {
                const newRules = { ...acc };
                delete newRules[ruleIdToDelete];

                return newRules;
            }, state);
        }

        case actionTypes.UPDATE_RULE_OPERATOR: {
            const newRule = state[action.payload.ruleId].clone();
            newRule.operator = action.payload.operator;

            return {
                ...state,
                [action.payload.ruleId]: newRule,
            };
        }

        case actionTypes.ADD_CONDITION: {
            const newRule = state[action.payload.ruleId].clone();
            newRule.conditionIds.push(action.payload.condition.id);

            return {
                ...state,
                [action.payload.ruleId]: newRule,
            };
        }

        case actionTypes.DELETE_CONDITIONS: {
            return Object.keys(state).reduce((allRules, ruleId) => {
                const clone = state[ruleId].clone();
                
                clone.conditionIds = clone.conditionIds.filter(conditionId => (
                    action.payload.conditionIds.indexOf(conditionId) === -1
                ));

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

        case actionTypes.DELETE_RESULTS: {
            return Object.keys(state).reduce((allRules, ruleId) => {
                const clone = state[ruleId].clone();

                clone.resultIds = clone.resultIds.filter(resultId => (
                    action.payload.resultIds.indexOf(resultId) === -1
                ));

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
