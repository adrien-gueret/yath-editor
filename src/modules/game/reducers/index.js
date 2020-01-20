import { combineReducers } from 'redux';

import name from './name';
import isTesting from './isTesting';

export default combineReducers({
  isTesting,
  name,
});