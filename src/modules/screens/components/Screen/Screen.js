import React, { useRef, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Draggable from 'react-draggable';

import { Chip, Tooltip, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        zIndex: 1,
        cursor: 'move',
    },
}), { classNamePrefix: 'Screen' });

function Screen({ screenId }) {
    const domElement = useRef(null);
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    const hasLinkWithoutTarget = useSelector(state => selectors.list.hasLinkWithoutTarget(state, screenId));

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

    const classes = useStyles();

    return (
        <Draggable
            bounds="parent"
            defaultPosition={screen}
            onDrag={dragScreen}
        >
            <Tooltip title={hasLinkWithoutTarget ? 'This screen has some links without targets' : ''}>
                <Chip
                    className={classes.root}
                    icon={screen.isStart ? <FlagIcon /> : null}
                    color={hasLinkWithoutTarget ? 'secondary' : 'primary'}
                    label={screen.name}
                    deleteIcon={<EditIcon />}
                    onDelete={editScreen}
                    ref={domElement}
                />
            </Tooltip>
        </Draggable>
    );
}

export default Screen;