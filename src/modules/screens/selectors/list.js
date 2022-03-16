import { getArrow } from 'Modules/board';
import { selectors as linkSelectors } from 'Modules/links';
import { selectors as logicSelectors } from 'Modules/logic';

import editedScreenId from './editedScreenId';

function get(state) {
    return state.screens.list;
}

function getAsArray(state) {
    const allScreens = get(state);
    return Object.keys(allScreens)
        .map(screenId => allScreens[screenId])
        .sort((screenA, screenB) => screenA.name.localeCompare(screenB.name));
}

function getAllSlugs(state) {
    const screens = getAsArray(state);
    return screens.map(screen => screen.getSlug());
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

    const allArrows = screens.reduce((allArrows, sourceScreen) => {
        const screenLinks = linkSelectors.list.getByIds(state, sourceScreen.linkIds);
        const screenRules = logicSelectors.rules.getByScreenId(state, sourceScreen.id);
        const screenResults = screenRules.flatMap((rule) => (
            logicSelectors.results.getByRuleId(state, rule.id)
        ));

        function getScreenArrow(targetScreenId, arrowType) {
            const targetScreen = getById(state, targetScreenId);

            if (!targetScreen) {
                return null;
            }

            return { ...getArrow(sourceScreen, targetScreen), type: arrowType };
        }

        const linksArrows = screenLinks.map(link => {
            const arrowType = screenResults.some(result => result.params.linkId === link.id) ? 'hideable' : '';
            const arrow = getScreenArrow(link.targetScreenId, arrowType);

            return arrow;
        });

        const logicArrows = screenRules.reduce((arrows, rule) => {
            const resultsWithScreenRedirect = logicSelectors.results.getByRuleId(state, rule.id)
                .filter(result => !!result.params.screenId);

            const targerScreenIds = resultsWithScreenRedirect.map(result => result.params.screenId);
          
            return [
                ...arrows,
                ...targerScreenIds
                    .map((targetScreenId) => getScreenArrow(targetScreenId, 'logic'))
            ];
        }, []);

        return [
            ...allArrows,
            ...linksArrows.filter(arrow => !!arrow),
            ...logicArrows.filter(arrow => !!arrow),
        ];
    }, []);

    return allArrows;
    
    /*
    .filter((arrowToFilter, arrowIndex, allArrows) => {
        const { x: startX, y: startY } = arrowToFilter.start;
        const { x: endX, y: endY } = arrowToFilter.end;

        return allArrows.findIndex((arrow) => (
            arrow.start.x === startX && arrow.start.y === startY &&
            arrow.end.x === endX && arrow.end.y === endY
        )) === arrowIndex;
    });*/
}

function getMaxCoordinates(state) {
    return getAsArray(state).reduce(({ x, y }, screen) => ({
        x: Math.max(x, screen.x + screen.width),
        y: Math.max(y, screen.y + screen.height),
    }), { x: 0, y: 0 });
}

export default {
    get,
    getAsArray,
    getAllSlugs,
    getMaxCoordinates,
    getAllExceptOne,
    getById,
    hasLinkWithoutTarget,
    getStart,
    getArrows,
    getEditedScreen,
    getFirstImage,
};