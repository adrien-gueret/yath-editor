import selectors from './rules';

function get(state) {
    return state.logic.conditionGroups;
}

function getAsArray(state) {
    const allConditionGroups = get(state);
    return Object.keys(allConditionGroups).map(conditionGroupId => (
        allConditionGroups[conditionGroupId]
    ));
}

function getById(state, conditionGroupId) {
    const allConditionGroups = get(state);
    return allConditionGroups[conditionGroupId] || null;
}

function getByIds(state, conditionGroupIds = []) {
    const allConditionGroups = get(state);
    return conditionGroupIds.map(conditionGroupId => (
        allConditionGroups[conditionGroupId])
            .filter(conditionGroup => !!conditionGroup)
    );
}

function getByRuleId(state, ruleId) {
    const rule = selectors.list.getById(state, ruleId);
    return getByIds(state, rule ? rule.conditionGroupIds : []);
}

export default {
    get,
    getAsArray,
    getById,
    getByIds,
    getByRuleId,
};