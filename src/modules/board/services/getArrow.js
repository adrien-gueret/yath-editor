import { geometry } from 'Modules/maths';

export default function getArrow(fromScreen, targetScreen, isLogic = false) {
    const fromScreenPosition = fromScreen.getCoordinates();
    const start = { x: fromScreenPosition.x + fromScreen.width/2, y: fromScreenPosition.y + fromScreen.height/2 };

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

    return { start, end, isLogic };
}