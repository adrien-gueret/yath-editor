import slugify from 'slugify';

import { selectors as linkSelectors } from 'Modules/links';
import { selectors as screensSelectors } from 'Modules/screens';
import { downloadHtml } from 'Modules/utils';

import actionTypes from '../actions/types';
import { getFullHtml } from '../services';
import selectors from '../selectors';


export default store => next => action => {
    if (action.type !== actionTypes.DOWNLOAD_GAME) {
        return next(action);
    }

    const state = store.getState();
    
    const screens = screensSelectors.list.getAsArray(state);
    const links = linkSelectors.list.get(state);
    const startScreen = screensSelectors.list.getStart(state);
    const gameName = selectors.name.get(state);
    const customCSS = selectors.customCSS.getExportable(state);
    const externalToolsParameters = selectors.otherParameters.get(state);
    const globalSettings = selectors.globalSettings.get(state);

    getFullHtml(gameName, screens, links, state.logic, startScreen, customCSS, globalSettings, externalToolsParameters)
        .then(html => downloadHtml(slugify(gameName), html));
}