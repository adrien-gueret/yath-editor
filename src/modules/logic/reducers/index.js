import { combineReducers } from 'redux';

import conditions from './conditions';
import conditionGroups from './conditionGroups';
import results from './results';
import rules from './rules';

export default combineReducers({
    conditions,
    conditionGroups,
    results,
    rules,
});