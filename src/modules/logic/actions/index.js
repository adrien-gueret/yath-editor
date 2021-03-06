import actionTypes from './types';

export default {
    addRule(rule, screenId) {
        return { type: actionTypes.ADD_RULE, payload: { rule, screenId } };
    },
    deleteRule(ruleId) {
        return { type: actionTypes.DELETE_RULES, payload: { ruleIds: [ruleId] } };
    },
    deleteRules(ruleIds) {
        return { type: actionTypes.DELETE_RULES, payload: { ruleIds } };
    },
    updateRuleOperator(ruleId, operator) {
        return { type: actionTypes.UPDATE_RULE_OPERATOR, payload: { ruleId, operator } };
    },

    addCondition(condition, ruleId) {
        return {
            type: actionTypes.ADD_CONDITION,
            payload: { condition, ruleId },
        };
    },
    deleteCondition(conditionId) {
        return {
            type: actionTypes.DELETE_CONDITIONS,
            payload: { conditionIds: [conditionId] },
        };
    },
    deleteConditions(conditionIds) {
        return {
            type: actionTypes.DELETE_CONDITIONS,
            payload: { conditionIds },
        };
    },
    updateConditionSubject(conditionId, conditionSubject) {
        return {
            type: actionTypes.UPDATE_CONDITION_SUBJECT,
            payload: { conditionId, conditionSubject },
        };
    },
    updateConditionParams(conditionId, conditionParams) {
        return {
            type: actionTypes.UPDATE_CONDITION_PARAMS,
            payload: { conditionId, conditionParams },
        };
    },

    addResult(result, ruleId) {
        return {
            type: actionTypes.ADD_RESULT,
            payload: { result, ruleId },
        };
    },
    deleteResult(resultId) {
        return {
            type: actionTypes.DELETE_RESULTS,
            payload: { resultIds: [resultId] },
        };
    },
    deleteResults(resultIds) {
        return {
            type: actionTypes.DELETE_RESULTS,
            payload: { resultIds },
        };
    },
    updateResultType(resultId, resultType) {
        return {
            type: actionTypes.UPDATE_RESULT_TYPE,
            payload: { resultId, resultType },
        };
    },
    updateResultParams(resultId, resultParams) {
        return {
            type: actionTypes.UPDATE_RESULT_PARAMS,
            payload: { resultId, resultParams },
        };
    },

    deleteAllLogic() {
        return { type: actionTypes.DELETE_ALL_LOGIC };
    },
    loadLogic(logicData) {
        return { type: actionTypes.LOAD_LOGIC, payload: { logicData } };
    },
}