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

function areArrowsEqual(arrowA, arrowB) {
    return (
        arrowA.start.x === arrowB.start.x && arrowA.start.y === arrowB.start.y &&
        arrowA.end.x === arrowB.end.x && arrowA.end.y === arrowB.end.y
    );
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
            const arrowType = screenResults.some(result => result.params.linkId === link.id) ? 'hideable' : 'normal';
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

    const uniqArrows = allArrows.filter((arrowToFilter, arrowIndex, allArrows) => (
        allArrows.findIndex((arrow) => (
            areArrowsEqual(arrow, arrowToFilter)
        )) === arrowIndex
    ));

    if (uniqArrows.length === allArrows.length) {
        return allArrows;
    }

    const dupplicatedArrows = allArrows.filter((arrowToFilter, arrowIndex, allArrows) => (
        allArrows.findIndex((arrow) => (
            areArrowsEqual(arrow, arrowToFilter)
        )) !== arrowIndex
    ));

    const deltasX = [-20, 20, 0];

    return uniqArrows.flatMap((arrow) => {
        const dupplicated = dupplicatedArrows.filter((dupplicatedArrow) => areArrowsEqual(dupplicatedArrow, arrow));

        if (dupplicated.length === 0) {
            return arrow;
        }

        const allTypes = [arrow.type].concat(dupplicated.map(({ type }) => type))
            .filter((type, index, types) => types.indexOf(type) === index);

        return allTypes.map((arrowType, index) => ({
            ...arrow,
            type: arrowType,
            end: {
                ...arrow.end,
                x: arrow.end.x + deltasX[index],
            },
        }));
    });
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