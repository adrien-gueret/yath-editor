import selectors from 'Modules/screens/selectors';

function get(state) {
    return state.logic.rules;
}

function getAsArray(state) {
    const allRules = get(state);
    return Object.keys(allRules).map(ruleId => allRules[ruleId]);
}

function getById(state, ruleId) {
    const allRules = get(state);
    return allRules[ruleId] || null;
}

function getByIds(state, ruleIds = []) {
    const allRules = get(state);
    return ruleIds.map(ruleId => allRules[ruleId]).filter(rule => !!rule);
}

function getByScreenId(state, screenId) {
    const screen = selectors.list.getById(state, screenId);
    return getByIds(state, screen ? screen.logicRuleIds : []);
}

export default {
    get,
    getAsArray,
    getById,
    getByIds,
    getByScreenId,
};