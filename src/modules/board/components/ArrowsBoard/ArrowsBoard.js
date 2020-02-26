import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core';

import { selectors as screenSelectors } from 'Modules/screens';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        pointerEvents: 'none',
        zIndex: 0,
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    marker: {
        fill: palette.common.black,
        stroke: palette.common.white,
    },
    logicMarker: {
        fill: palette.primary.main,
    },
    arrow: {
        stroke: 'rgba(0, 0, 0, .4)',
        strokeWidth: '2px',
        markerEnd: 'url(#arrow)',
    },
    logicArrow: {
        stroke: palette.primary.main,
        strokeDasharray: 8,
        markerEnd: 'url(#logic-arrow)',
    },
}), { classNamePrefix: 'ArrowsBoard' });

function ArrowMarker({ id, className }) {
    return (
        <marker id={id} markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto">
            <path d="M2,1 L2,10 L10,6 L2,2" className={className} />
        </marker>
    );
}

function ArrowsBoard () {
    const arrows = useSelector(screenSelectors.list.getArrows, shallowEqual);
    const classes = useStyles();

    return (
        <svg width="100%" height="100%" className={classes.root}>
            <defs>
                <ArrowMarker id="arrow" className={classes.marker} />
                <ArrowMarker id="logic-arrow" className={`${classes.marker} ${classes.logicMarker}`} />
            </defs>
            {
                arrows.map((arrow, index) => (
                    <path
                        key={index}
                        d={`M${arrow.start.x},${arrow.start.y} L${arrow.end.x},${arrow.end.y}`}
                        className={`${classes.arrow} ${arrow.isLogic ? classes.logicArrow : ''}`}
                     />
                ))
            }
        </svg>
    );
}

export default ArrowsBoard;