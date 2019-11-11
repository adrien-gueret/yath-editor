import { geometry } from 'Modules/maths';
import { selectors as screensChoicesSelectors } from 'Modules/screensChoices';

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

function hasChoiceWithoutTarget(state, screenId) {
    const screen = getById(state, screenId);

    if (!screen) {
        return false;
    }

    const choices = screensChoicesSelectors.list.getByIds(state, screen.choicesIds);
    return choices.some(choice => !choice.targetScreenId);
}

function getStart(state) {
    const screens = getAsArray(state);
    const startScreen = screens.filter(screen => screen.isStart);
    return startScreen[0] || null;
}

function getArrows(state) {
    const screens = getAsArray(state);

    return screens.reduce((allArrows, screen) => {
        const start = { x: screen.x + screen.width/2, y: screen.y + screen.height/2 };

        const choices = screensChoicesSelectors.list.getByIds(state, screen.choicesIds);

        const newArrows = choices.map(choice => {
            const targetScreen = getById(state, choice.targetScreenId);

            if (!targetScreen) {
                return null;
            }

            const targetCenter = { x: targetScreen.x + targetScreen.width/2, y: targetScreen.y + targetScreen.height/2 };

            const topSegment = {
                start: { x: targetScreen.x, y: targetScreen.y },
                end: { x: targetScreen.x + targetScreen.width, y: targetScreen.y },
            };

            const rightSegment = {
                start: { x: targetScreen.x + targetScreen.width, y: targetScreen.y },
                end: { x: targetScreen.x + targetScreen.width, y: targetScreen.y + targetScreen.height },
            };

            const bottomSegment = {
                start: { x: targetScreen.x, y: targetScreen.y + targetScreen.height },
                end: { x: targetScreen.x + targetScreen.width, y: targetScreen.y + targetScreen.height },
            };

            const leftSegment = {
                start: { x: targetScreen.x, y: targetScreen.y },
                end: { x: targetScreen.x, y: targetScreen.y + targetScreen.height },
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
    hasChoiceWithoutTarget,
    getStart,
    getArrows,
    getEditedScreen,
};