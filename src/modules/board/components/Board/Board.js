import './board.less';

import React, { useState, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import DragSelect from 'dragselect';

import { actions as screenActions, selectors as screenSelectors, Screen, ScreenEdit, actionTypes } from 'Modules/screens';

import ArrowsBoard from '../ArrowsBoard';

const useStyles = makeStyles(() => ({
    selector: {
        zIndex: 100,
    },
}), { classNamePrefix: 'Board' });

function Board() {
    const editedScreenId = useSelector(screenSelectors.editedScreenId.get);
    const screens = useSelector(screenSelectors.list.getAsArray, shallowEqual);
    
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectScreen = useCallback((screenId) => dispatch(screenActions.selectScreen(screenId)), [dispatch]);
    const unselectScreen = useCallback((screenId) => dispatch(screenActions.unselectScreen(screenId)), [dispatch]);
    const moveScreens = useCallback((screenIds, deltaX, deltaY) => dispatch(screenActions.moveScreens(screenIds, deltaX, deltaY)), [dispatch]);

    const [dragSelect] = useState(() => new DragSelect({
        selectorClass: classes.selector,
        multiSelectMode: true,
        onElementSelect(domElement) {
            selectScreen(domElementToScreenIdMap.get(domElement));
        },
        onElementUnselect(domElement) {
            unselectScreen(domElementToScreenIdMap.get(domElement));
        },
    }));

    const [domElementToScreenIdMap] = useState(new Map());

    const getScreenRef = useCallback((screenId) => (domElement) => {
        if (!domElement || !dragSelect) {
            return;
        }

        domElementToScreenIdMap.set(domElement, screenId);
        dragSelect.addSelectables(domElement);
    }, [dragSelect]);

    const onScreenDragStartHandler = useCallback((screenId) => {
        if (!dragSelect) {
            return;
        }

        selectScreen(screenId);
        dragSelect.break();
    }, [selectScreen, dragSelect]);

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
            window.setTimeout(() => selectScreen(screenId), 0);
        }
       
    }, [selectScreen, dragSelect]);

    return (
        <section className="yathBoard">
            {
                screens.map(screen =>  (
                    <Screen
                        key={ screen.id }
                        screenId={screen.id}
                        ref={getScreenRef(screen.id)}
                        onDragStart={onScreenDragStartHandler}
                        onDrag={onScreenDragHandler}
                        onDragStop={onScreenDragStopHandler}
                    />
                ))
            }
            { editedScreenId && <ScreenEdit screenId={editedScreenId} /> }
            <ArrowsBoard />
        </section>
    );
}

export default Board;