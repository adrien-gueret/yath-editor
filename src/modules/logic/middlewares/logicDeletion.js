import actions from '../actions';
import actionTypes from '../actions/types';
import selectors from '../selectors';

export default store => next => action => {
    const state = store.getState();

    switch(action.type) {
        case actionTypes.DELETE_RULES: {
            action.payload.ruleIds.forEach((ruleId) => {
                const rule = selectors.rules.getById(state, ruleId);
                store.dispatch(actions.deleteConditionGroups(rule.conditionGroupIds));
                store.dispatch(actions.deleteResults(rule.resultIds));
            });
            break;
        }

        case actionTypes.DELETE_CONDITION_GROUPS: {
            action.payload.conditionGroupIds.forEach((conditionGroupId) => {
                const conditionGroup = selectors.conditionGroups.getById(state, conditionGroupId);
                store.dispatch(actions.deleteConditions(conditionGroup.conditionIds));
            });
            break;
        }

        default: break;
    }

    return next(action);
}