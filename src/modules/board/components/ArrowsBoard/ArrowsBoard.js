import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { selectors as screenSelectors } from 'Modules/screens';
import './arrowsBoard.less';

function ArrowsBoard () {
    const arrows = useSelector(screenSelectors.list.getArrows, shallowEqual);

    return (
        <svg width="100%" height="100%" className="arrowsBoard">
            <defs>
                <marker id="arrow" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto">
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

export default ArrowsBoard;