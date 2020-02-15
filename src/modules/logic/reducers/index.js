import { combineReducers } from 'redux';

import conditions from './conditions';
import results from './results';
import rules from './rules';

export default combineReducers({
    conditions,
    results,
    rules,
});