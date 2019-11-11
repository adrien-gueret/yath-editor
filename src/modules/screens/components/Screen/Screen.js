import './screen.less';

import React, { useRef, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Draggable from 'react-draggable';

import actions from '../../actions';
import selectors from '../../selectors';

function Screen({ screenId }) {
    const domElement = useRef(null);
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    const hasChoiceWithoutTarget = useSelector(state => selectors.list.hasChoiceWithoutTarget(state, screenId));

    const resizeScreen = useCallback((newWidth, newHeight) => (
        dispatch(actions.resizeScreen(screenId, newWidth, newHeight))
    ), [dispatch, screenId]);

    const editScreen = useCallback(() => dispatch(actions.setEditScreen(screenId)), [dispatch, screenId]);
    const dragScreen = useCallback((e, data) => {
        dispatch(actions.moveScreen(screenId, data.x, data.y));
    }, [dispatch, screenId]);

    useEffect(() => {
        if (!domElement.current) {
            return;
        }
        
        const style = window.getComputedStyle(domElement.current);
        resizeScreen(style.width, style.height);
    }, [domElement.current, resizeScreen]);

    const className = 'yathScreen';
    const classError = hasChoiceWithoutTarget ? 'yathScreen--error' : '';
    const classStart = screen.isStart ? 'yathScreen--start' : '';

    return (
        <Draggable
            bounds="parent"
            defaultPosition={screen}
            handle=".yathScreen__name"
            onDrag={dragScreen}
        >
            <div
                className={`${className} ${classError} ${classStart}`}
                ref={domElement}
                title={hasChoiceWithoutTarget ? 'This screen has some choices without targets' : null}
            >
                <header className="yathScreen__header">
                    <span className="yathScreen__name">{ screen.name }</span>
                    <span
                        className="yathScreen__editButton"
                        onClick={editScreen}
                    >✏️</span>
                </header>
            </div>
        </Draggable>
    );
}

export default Screen;