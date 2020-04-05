import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import DragSelect from 'dragselect';

import { actions as screenActions, selectors as screenSelectors, Screen } from 'Modules/screens';

import ArrowsBoard from '../ArrowsBoard';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        position: 'relative',
        margin: 0,
        width: '1000vw',
        height: '1000vh',
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
    const screens = useSelector(screenSelectors.list.getAsArray, shallowEqual);
    const totalSelectedScreens = useMemo(() => screens.filter(screen => screen.isSelected).length, [screens]);
    
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectScreen = useCallback((screenId) => dispatch(screenActions.selectScreen(screenId)), [dispatch]);
    const unselectScreen = useCallback((screenId) => dispatch(screenActions.unselectScreen(screenId)), [dispatch]);
    const moveScreens = useCallback((screenIds, deltaX, deltaY) => dispatch(screenActions.moveScreens(screenIds, deltaX, deltaY)), [dispatch]);

    const [draggedScreenInitialStatus, setDraggedScreenInitialStatus] = useState(false);

    const dragSelect = useMemo(() => new DragSelect({
        selectorClass: classes.selector,
        multiSelectMode: true,
        multiSelectKeys: [],
        onElementSelect(domElement) {
            selectScreen(domElementToScreenIdMap.get(domElement));
        },
        onElementUnselect(domElement) {
            unselectScreen(domElementToScreenIdMap.get(domElement));
        },
    }), []);

    const [domElementToScreenIdMap] = useState(new Map());
    const [screenIdToDomElementMap] = useState(new Map());

    const forceSelectScreen = useCallback((screenId) => {
        if (isDialogOpen) {
            return;
        }
        
        const domElement = screenIdToDomElementMap.get(screenId);

        if (dragSelect.getSelectables().indexOf(domElement) === -1)  {
            return;
        }

        dragSelect.addSelection(domElement);
    }, [dragSelect, isDialogOpen]);

    const forceUnselectScreen = useCallback((screenId) => {
        dragSelect.removeSelection(screenIdToDomElementMap.get(screenId));
    }, [dragSelect]);

    const clearSelection = useCallback(() => {
        dragSelect.clearSelection();
    }, [dragSelect]);

    const getScreenRef = useCallback((screenId) => (domElement) => {
        if (!domElement || !dragSelect) {
            return;
        }

        domElementToScreenIdMap.set(domElement, screenId);
        screenIdToDomElementMap.set(screenId, domElement);
        dragSelect.addSelectables(domElement);
    }, [dragSelect]);

    const onScreenDragStartHandler = useCallback((screenId, isSelected) => {
        if (!dragSelect) {
            return;
        }

        if (!isSelected) {
            forceSelectScreen(screenId);
        }
        
        setDraggedScreenInitialStatus(isSelected);
        
        dragSelect.break();
    }, [dragSelect, forceSelectScreen]);

    const onScreenDragHandler = useCallback((screenId, deltaX, deltaY) => {
        const otherSelectedScreens = screens.filter(screen => screen.isSelected && screen.id !== screenId);

        if (otherSelectedScreens.length === 0) {
            return;
        }

        moveScreens(otherSelectedScreens.map(screen => screen.id), deltaX, deltaY);
    }, [screens]);

    const onScreenDragStopHandler = useCallback((screenId, deltaX, deltaY) => {
        if (!dragSelect) {
            return;
        }

        dragSelect.start();

        if (deltaX !== 0 || deltaY !== 0) {
            if (totalSelectedScreens > 1) {
                window.setTimeout(() => forceSelectScreen(screenId), 0);
            }
        } else {
            window.setTimeout(() => {
                if (draggedScreenInitialStatus) {
                    forceUnselectScreen(screenId);
                } else {
                    forceSelectScreen(screenId);
                }
            }, 0);
        }
       
    }, [forceSelectScreen, forceUnselectScreen, dragSelect, draggedScreenInitialStatus, totalSelectedScreens, ]);

    useEffect(() => {
        if (!dragSelect || (!editedScreenId && !isDialogOpen)) {
            return;
        }

        const domElement = screenIdToDomElementMap.get(editedScreenId);

        clearSelection();

        dragSelect.removeSelectables(domElement);
        dragSelect.stop(false);

        return () => { dragSelect.start(); dragSelect.addSelectables(domElement);};
    }, [dragSelect, editedScreenId, clearSelection, isDialogOpen]);

    return (
        <section className={classes.root} onDoubleClick={clearSelection}>
            {
                screens.map(screen =>  (
                    <Screen
                        key={screen.id}
                        screenId={screen.id}
                        ref={getScreenRef(screen.id)}
                        onDragStart={onScreenDragStartHandler}
                        onDrag={onScreenDragHandler}
                        onDragStop={onScreenDragStopHandler}
                    />
                ))
            }
            <ArrowsBoard />
        </section>
    );
}

export default Board;