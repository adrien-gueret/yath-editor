import actions from '../actions';
import actionTypes from '../actions/types';
import selectors from '../selectors';

export default store => next => action => {
    const state = store.getState();

    switch(action.type) {
        case actionTypes.DELETE_RULES: {
            action.payload.ruleIds.forEach((ruleId) => {
                const rule = selectors.rules.getById(state, ruleId);
                store.dispatch(actions.deleteConditions(rule.conditionIds));
                store.dispatch(actions.deleteResults(rule.resultIds));
            });
            break;
        }

        default: break;
    }

    return next(action);
}