import { connect } from 'react-redux'

import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';

import { getSegmentsIntersectionPoint } from 'Modules/maths/services/geometry';

import ArrowsBoard from './ArrowsBoard';

const mapStateToProps = (state) => {
    const screens = screensSelectors.getAsArray(state);

    const arrows = screens.reduce((allArrows, screen) => {
        const start = { x: screen.x + screen.width/2, y: screen.y + screen.height/2 };

        const choices = screensChoicesSelectors.getByIds(state, screen.choicesIds);

        const newArrows = choices.map(choice => {
            const targetScreen = screensSelectors.getById(state, choice.targetScreenId);

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
                getSegmentsIntersectionPoint(arrow, segment) || finalEnd
            ), targetCenter);

            return { start, end };
        });

        return [
            ...allArrows,
            ...newArrows.filter(arrow => !!arrow),
        ];

    }, []);

    return { arrows };
};

const ArrowsBoardContainer = connect(mapStateToProps)(ArrowsBoard);

export default ArrowsBoardContainer;