import './board.less';

import React, { useState, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import DragSelect from 'dragselect';

import { actions as screenActions, selectors as screenSelectors, Screen, ScreenEdit } from 'Modules/screens';

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

    const [dragSelect] = useState(() => new DragSelect({
        selectorClass: classes.selector,
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

    const onScreenDragStartHandler = useCallback(() => {
        if (!dragSelect) {
            return;
        }
        dragSelect.break();

    }, [dragSelect]);

    const onScreenDragStopHandler = useCallback(() => {
        if (!dragSelect) {
            return;
        }
        dragSelect.start();

    }, [dragSelect]);

    return (
        <section className="yathBoard">
            {
                screens.map(screen =>  (
                    <Screen
                        key={ screen.id }
                        screenId={screen.id}
                        ref={getScreenRef(screen.id)}
                        onDragStart={onScreenDragStartHandler}
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