import { combineReducers } from 'redux';

import name from './name';
import isConfiguring from './isConfiguring';
import isTesting from './isTesting';

export default combineReducers({
  isConfiguring,
  isTesting,
  name,
});