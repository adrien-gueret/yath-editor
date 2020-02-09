import selectors from './conditionGroups';

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

function getByConditionGroupId(state, conditionGroupId) {
    const conditionGroup = selectors.list.getById(state, conditionGroupId);
    return getByIds(state, conditionGroup ? conditionGroup.conditionIds : []);
}

export default {
    get,
    getAsArray,
    getById,
    getByIds,
    getByConditionGroupId,
};