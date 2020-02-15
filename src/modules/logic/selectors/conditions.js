import selectors from './rules';

function get(state) {
    return state.logic.conditions;
}

function getAsArray(state) {
    const allConditions = get(state);
    return Object.keys(allConditions).map(conditionId => (
        allConditions[conditionId]
    ));
}

function getById(state, conditionId) {
    const allConditions = get(state);
    return allConditions[conditionId] || null;
}

function getByIds(state, conditionIds = []) {
    const allConditions = get(state);
    return conditionIds.map(conditionId => (
        allConditions[conditionId])
            .filter(condition => !!condition)
    );
}

function getByRuleId(state, ruleId) {
    const rule = selectors.getById(state, ruleId);
    return getByIds(state, rule ? rule.conditionIds : []);
}

export default {
    get,
    getAsArray,
    getById,
    getByIds,
    getByRuleId,
};