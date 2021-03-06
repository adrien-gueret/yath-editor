import { getArrow } from 'Modules/board';
import { selectors as linkSelectors } from 'Modules/links';
import { selectors as logicSelectors } from 'Modules/logic';

import editedScreenId from './editedScreenId';

function get(state) {
    return state.screens.list;
}

function getAsArray(state) {
    const allScreens = get(state);
    return Object.keys(allScreens).map(screenId => allScreens[screenId]);
}

function getById(state, screenId) {
    const screens = get(state);
    return screens[screenId] || null;
}

function getEditedScreen(state) {
    return getById(state, editedScreenId.get(state));
}

function getAllExceptOne(state, screenId) {
    return getAsArray(state).filter(screen => screen.id !== screenId);
}

function hasLinkWithoutTarget(state, screenId) {
    const screen = getById(state, screenId);

    if (!screen) {
        return false;
    }

    const links = linkSelectors.list.getByIds(state, screen.linkIds);
    return links.some(link => !link.targetScreenId);
}

function getStart(state) {
    const screens = getAsArray(state);
    const startScreen = screens.filter(screen => screen.isStart);
    return startScreen[0] || null;
}

function getFirstImage(state) {
    const screens = getAsArray(state);
    const firstScreenWithImage = screens.find(screen => Boolean(screen.image));

    return firstScreenWithImage ? firstScreenWithImage.image : null;
}

function getArrows(state) {
    const screens = getAsArray(state);

    return screens.reduce((allArrows, sourceScreen) => {
        const links = linkSelectors.list.getByIds(state, sourceScreen.linkIds);

        function getScreenArrow(targetScreenId, isLogic) {
            const targetScreen = getById(state, targetScreenId);

            if (!targetScreen) {
                return null;
            }

            return getArrow(sourceScreen, targetScreen, isLogic);
        }

        const linksArrows = links.map(link => getScreenArrow(link.targetScreenId));

        const rules = logicSelectors.rules.getByScreenId(state, sourceScreen.id);

        const logicArrows = rules.reduce((arrows, rule) => {
            const resultsWithScreenRedirect = logicSelectors.results.getByRuleId(state, rule.id).filter(result => !!result.params.screenId);
            const isLogic = true;

            return [
                ...arrows,
                ...resultsWithScreenRedirect
                    .map(({ params }) => getScreenArrow(params.screenId, isLogic))
            ];
        }, []);


        return [
            ...allArrows,
            ...linksArrows.filter(arrow => !!arrow),
            ...logicArrows.filter(arrow => !!arrow),
        ];
    }, []);
}

export default {
    get,
    getAsArray,
    getAllExceptOne,
    getById,
    hasLinkWithoutTarget,
    getStart,
    getArrows,
    getEditedScreen,
    getFirstImage,
};