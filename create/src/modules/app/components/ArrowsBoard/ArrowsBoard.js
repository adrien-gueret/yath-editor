import './arrowsBoard.less';

import React, { PropTypes } from 'react';

const pointPropType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
});

const arrowPropType = PropTypes.shape({
    start: pointPropType.isRequired,
    end: pointPropType.isRequired,
});

const propTypes = {
    arrows: PropTypes.arrayOf(arrowPropType),
};

const defaultProps = {
  arrows: [],
};

function ArrowsBoard ({ arrows }) {
    return (
        <svg width="100%" height="100%" className="arrowsBoard">
            <defs>
                <marker id="arrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
                    <path d="M2,1 L2,10 L10,6 L2,2" className="arrowsBoard__arrowMarker" />
                </marker>
            </defs>
            {
                arrows.map((arrow, index) => (
                    <path
                        key={index}
                        d={`M${arrow.start.x},${arrow.start.y} L${arrow.end.x},${arrow.end.y}`}
                        className="arrowsBoard__arrow"
                     />
                ))
            }
        </svg>
    );
}

ArrowsBoard.propTypes = propTypes;
ArrowsBoard.defaultProps = defaultProps;

export default ArrowsBoard;