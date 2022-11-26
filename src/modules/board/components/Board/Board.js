import React, { useMemo, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { selectors as screenSelectors, useAddScreenDialog } from 'Modules/screens';

import ScreensBoard from '../ScreensBoard';
import ArrowsBoard from '../ArrowsBoard';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        position: 'relative',
        margin: 0,
        minWidth: '100vw',
        minHeight: '100vh',
        width: ({ maxCoordinates }) => maxCoordinates.x + 500,
        height: ({ maxCoordinates }) => maxCoordinates.y + 500,
        backgroundColor: '#e3e3e3',
        backgroundImage:
          `linear-gradient(white 2px, transparent 2px),
          linear-gradient(90deg, white 2px, transparent 2px),
          linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
    },
    selector: {
        zIndex: 100,
    },
}), { classNamePrefix: 'Board' });

function Board({ isDialogOpen }) {
    const editedScreenId = useSelector(screenSelectors.editedScreenId.get);
    const dragSelectRef = useRef(null);
    
    const maxCoordinates = useSelector(screenSelectors.list.getMaxCoordinates, shallowEqual);

    const { openAddScreenDialog, addScreenDialog } = useAddScreenDialog(true);

    const classes = useStyles({ maxCoordinates });

    const onClick = (e) => {
        const { x, y } = dragSelectRef.current.getCursorPositionDifference();
        
        if (!e.shiftKey && x === 0 && y === 0) {
            dragSelectRef.current.clearSelection();
        }
    };

    const onDoubleClick = (e) => {
        openAddScreenDialog({
            screenPosition: {
                x: e.clientX,
                y: e.clientY,
            }
        });
    };

    useEffect(() => {
        if (!dragSelectRef.current || (!editedScreenId && !isDialogOpen)) {
            return;
        }

        dragSelectRef.current.clearSelection();
        dragSelectRef.current.stop(false);

        return () => { dragSelectRef.current.start();};
    }, [dragSelectRef.current, editedScreenId, isDialogOpen]);

    return (
        <section className={classes.root} onClick={onClick} onDoubleClick={onDoubleClick}>
            {addScreenDialog}
            <ScreensBoard disableForceSelect={isDialogOpen} dragSelectRef={dragSelectRef} />
            <ArrowsBoard />
        </section>
    );
}

export default Board;