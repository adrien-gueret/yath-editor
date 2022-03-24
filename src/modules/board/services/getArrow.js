import { geometry } from 'Modules/maths';

export default function getArrow(fromScreen, targetScreen) {
    const fromScreenPosition = fromScreen.getCoordinates();
    const start = { x: Math.round(fromScreenPosition.x + fromScreen.width/2), y: Math.round(fromScreenPosition.y + fromScreen.height/2) };

    const targetPosition = targetScreen.getCoordinates();
    const targetCenter = { x: Math.round(targetPosition.x + targetScreen.width/2), y: Math.round(targetPosition.y + targetScreen.height/2) };

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
}