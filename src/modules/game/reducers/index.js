import { combineReducers } from 'redux';

import name from './name';
import isConfiguring from './isConfiguring';
import isTesting from './isTesting';
import customCSS from './customCSS';
import globalSettings from './globalSettings';
import otherParameters from './otherParameters';

export default combineReducers({
  isConfiguring,
  isTesting,
  name,
  customCSS,
  globalSettings,
  otherParameters,
});