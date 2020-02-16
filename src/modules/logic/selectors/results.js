import selectors from './rules';

function get(state) {
    return state.logic.results;
}

function getAsArray(state) {
    const allResults = get(state);
    return Object.keys(allResults).map(resultId => (
        allResults[resultId]
    ));
}

function getById(state, resultId) {
    const allResults = get(state);
    return allResults[resultId] || null;
}

function getByIds(state, resultIds = []) {
    const allResults = get(state);
    return resultIds.map(resultId => allResults[resultId]);
}

function getByRuleId(state, ruleId) {
    const rule = selectors.getById(state, ruleId);
    return getByIds(state, rule ? rule.resultIds : []);
}

function hasErrorsFromRuleId(state, ruleId) {
    const results = getByRuleId(state, ruleId);

    return results.some(result => result.hasError());
}

function getTotalErrorsFromRuleId(state, ruleId) {
    const results = getByRuleId(state, ruleId);

    return results.filter(result => result.hasError()).length;
}

export default {
    get,
    getAsArray,
    getById,
    getByIds,
    getByRuleId,
    hasErrorsFromRuleId,
    getTotalErrorsFromRuleId,
};