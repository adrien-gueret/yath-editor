// Algo from https://openclassrooms.com/forum/sujet/calcul-du-point-d-intersection-de-deux-segments-21661
function getLinesIntersectionPoint(line1, lineZ) {
    const line1Start = line1.start;
    const line1End = line1.end;
    const lineZStart = lineZ.start;
    const line2End = lineZ.end;

    const deltaLine1 = {
        x: line1End.x - line1Start.x,
        y: line1End.y - line1Start.y,
    };

    const deltaLine2 = {
        x: line2End.x - lineZStart.x,
        y: line2End.y - lineZStart.y,
    };

    const divisor = (deltaLine1.x * deltaLine2.y) - (deltaLine1.y * deltaLine2.x);

    if (divisor === 0) {
        return null;
    }

    const m = (
        (deltaLine1.x * line1Start.y) -
        (deltaLine1.x * lineZStart.y) -
        (deltaLine1.y * line1Start.x) +
        (deltaLine1.y * lineZStart.x)
    ) / divisor;

    return {
        x: Math.round(lineZStart.x + (m * deltaLine2.x)),
        y: Math.round(lineZStart.y + (m * deltaLine2.y)),
    };
}

function getSegmentsIntersectionPoint(segment1, segment2) {
    const intersection = getLinesIntersectionPoint(segment1, segment2);

    if (!intersection) {
        return null;
    }

    const minSeg1X = Math.min(segment1.start.x, segment1.end.x);
    const maxSeg1X = Math.max(segment1.start.x, segment1.end.x);
    const minSeg2X = Math.min(segment2.start.x, segment2.end.x);
    const maxSeg2X = Math.max(segment2.start.x, segment2.end.x);

    const minSeg1Y = Math.min(segment1.start.y, segment1.end.y);
    const maxSeg1Y = Math.max(segment1.start.y, segment1.end.y);
    const minSeg2Y = Math.min(segment2.start.y, segment2.end.y);
    const maxSeg2Y = Math.max(segment2.start.y, segment2.end.y);

    if (
        intersection.x >= minSeg1X &&
        intersection.x <= maxSeg1X &&
        intersection.x >= minSeg2X &&
        intersection.x <= maxSeg2X &&
        intersection.y >= minSeg1Y &&
        intersection.y <= maxSeg1Y &&
        intersection.y >= minSeg2Y &&
        intersection.y <= maxSeg2Y
    ) {
        return intersection;
    }

    return null;
}

export default {
    getLinesIntersectionPoint,
    getSegmentsIntersectionPoint,
};