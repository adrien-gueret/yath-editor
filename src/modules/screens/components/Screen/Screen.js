import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Draggable from 'react-draggable';

import { Chip, Tooltip, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Settings';
import FlagIcon from '@material-ui/icons/Flag';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        zIndex: 1,
        cursor: 'move',
    },
    label: {
        display: 'block',
        maxWidth: 200,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}), { classNamePrefix: 'Screen' });

function Screen({ screenId }) {
    const domElement = useRef(null);
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    const hasLinkWithoutTarget = useSelector(state => selectors.list.hasLinkWithoutTarget(state, screenId));

    const domElementStyle = useMemo(() => {
        if (!domElement.current) {
            return {};
        }

        return window.getComputedStyle(domElement.current);
    }, [domElement.current, screen.name]);

    const resizeScreen = useCallback((newWidth, newHeight) => (
        dispatch(actions.resizeScreen(screenId, newWidth, newHeight))
    ), [dispatch, screenId]);

    const editScreen = useCallback(() => dispatch(actions.setEditScreen(screenId)), [dispatch, screenId]);
    const dragScreen = useCallback((e, data) => {
        dispatch(actions.moveScreen(screenId, data.x, data.y));
    }, [dispatch, screenId]);
    const dragStop = useCallback((e, data) => {
        dispatch(actions.resetTempCoordinates(screenId));
    }, [dispatch, screenId]);

    useEffect(() => {
        if (!domElement.current) {
            return;
        }
        
        resizeScreen(domElementStyle.width, domElementStyle.height);
    }, [domElement.current, domElementStyle.width, domElementStyle.height, resizeScreen]);

    const classes = useStyles();

    const position = screen.getCoordinates();

    return (
        <Draggable
            bounds="parent"
            position={position}
            onDrag={dragScreen}
            onStop={dragStop}
        >
            <Tooltip title={hasLinkWithoutTarget ? 'This screen has some links without targets' : ''}>
                <Chip
                    classes={classes}
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