import { geometry } from 'Modules/maths';
import { selectors as linkSelectors } from 'Modules/links';

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

function getArrows(state) {
    const screens = getAsArray(state);

    return screens.reduce((allArrows, screen) => {
        const screenPosition = screen.getCoordinates();
        const start = { x: screenPosition.x + screen.width/2, y: screenPosition.y + screen.height/2 };

        const links = linkSelectors.list.getByIds(state, screen.linkIds);

        const newArrows = links.map(link => {
            const targetScreen = getById(state, link.targetScreenId);

            if (!targetScreen) {
                return null;
            }

            const targetPosition = targetScreen.getCoordinates();

            const targetCenter = { x: targetPosition.x + targetScreen.width/2, y: targetPosition.y + targetScreen.height/2 };

            const topSegment = {
                start: { x: targetPosition.x, y: targetPosition.y },
                end: { x: targetPosition.x + targetScreen.width, y: targetPosition.y },
            };

            const rightSegment = {
                start: { x: targetPosition.x + targetScreen.width, y: targetPosition.y },
                end: { x: targetPosition.x + targetScreen.width, y: targetPosition.y + targetScreen.height },
            };

            const bottomSegment = {
                start: { x: targetPosition.x, y: targetPosition.y + targetScreen.height },
                end: { x: targetPosition.x + targetScreen.width, y: targetPosition.y + targetScreen.height },
            };

            const leftSegment = {
                start: { x: targetPosition.x, y: targetPosition.y },
                end: { x: targetPosition.x, y: targetPosition.y + targetScreen.height },
            };

            const arrow = { start, end: targetCenter };

            const end = [topSegment, rightSegment, bottomSegment, leftSegment].reduce((finalEnd, segment) => (
                geometry.getSegmentsIntersectionPoint(arrow, segment) || finalEnd
            ), targetCenter);

            return { start, end };
        });

        return [
            ...allArrows,
            ...newArrows.filter(arrow => !!arrow),
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
};