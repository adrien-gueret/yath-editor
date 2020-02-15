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
    return resultIds.map(resultId => (
        allResults[resultId])
            .filter(result => !!result)
    );
}

function getByRuleId(state, ruleId) {
    const rule = selectors.getById(state, ruleId);
    return getByIds(state, rule ? rule.resultIds : []);
}

export default {
    get,
    getAsArray,
    getById,
    getByIds,
    getByRuleId,
};