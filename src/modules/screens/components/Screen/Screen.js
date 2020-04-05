import React, { forwardRef, useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Draggable from 'react-draggable';

import { Chip, Tooltip, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Settings';
import FlagIcon from '@material-ui/icons/Flag';
import BlockIcon from '@material-ui/icons/Block';
import LogicIcon from '@material-ui/icons/AccountTree';

import { selectors as logicSelectors } from 'Modules/logic';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        zIndex: 1,
        cursor: 'move',
        height: 40,
        userSelect: 'none',
    },
    label: {
        display: 'block',
        maxWidth: 200,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none',
    },
    outlined: {
        backgroundColor: ['#fff', '!important'],
    },
}), { classNamePrefix: 'Screen' });

function Screen({ screenId, onDragStart, onDrag, onDragStop }, ref) {
    const dispatch = useDispatch();
    const [showTooltip, toggleShowTooltip] = useState(true);
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    const hasLinkWithoutTarget = useSelector(state => selectors.list.hasLinkWithoutTarget(state, screenId));
    const totalLogicErrors = useSelector(state => logicSelectors.rules.getTotalErrorsByScreenId(state, screenId));
    const hasEmptyContent = !screen.content;
    const hasLinks = screen.linkIds.length > 0;
    const hasSomeLogic = screen.logicRuleIds.length > 0;
    const hasLogicErrors = totalLogicErrors > 0;

    const hasErrors = hasLinkWithoutTarget || hasEmptyContent || hasLogicErrors;

    const resizeScreen = useCallback((newWidth, newHeight) => (
        dispatch(actions.resizeScreen(screenId, newWidth, newHeight))
    ), [dispatch, screenId]);
    const editScreen = useCallback(() => dispatch(actions.setEditScreen(screenId)), [dispatch, screenId]);
    const dragScreen = useCallback((e, data) => {
        dispatch(actions.moveScreen(screenId, data.x, data.y));
        !onDrag(screenId, data.deltaX, data.deltaY);
    }, [dispatch, screenId, onDrag]);

    const dragStart = useCallback(() => {
        toggleShowTooltip(false);
        onDragStart(screenId, screen.isSelected);
    }, [onDragStart, screen, screenId]);
    
    const dragStop = useCallback((e, data) => {
        toggleShowTooltip(true);
        onDragStop(screenId, data.deltaX, data.deltaY);
    }, [onDragStop, screenId]);

    const domRef = useCallback((domElement) => {
        ref(domElement);
        if (!domElement) {
            return;
        }

        const { width, height } = window.getComputedStyle(domElement);

        if (!width || !height) {
            return;
        }
        
        resizeScreen(width, height);
    }, [screen.name]);

    const classes = useStyles();
    const position = screen.getCoordinates();

    const tooltipMessages = [];

    if (hasErrors) {
        if (hasEmptyContent) {
            tooltipMessages.push(<p key="no-content">This screen does not have content.</p>);
        }
        
        if (hasLinkWithoutTarget) {
            tooltipMessages.push(<p key="bad-link">This screen has some links without targets.</p>);
        }

        if (hasLogicErrors) {
            tooltipMessages.push(<p key="bad-logic">This screen has some logic errors.</p>);
        }
    }

    let icon = null;

    if (screen.isStart) {
        icon = <FlagIcon />;
    } else if (hasSomeLogic) {
        icon = <LogicIcon />;
    } else if (!hasLinks) {
        icon = <BlockIcon />;
    }

    return (
        <Draggable
            bounds={{ top: 60 }}
            position={position}
            onStart={dragStart}
            onDrag={dragScreen}
            onStop={dragStop}
            grid={[20, 20]}
        >
            <Tooltip title={(showTooltip && tooltipMessages.length) ? tooltipMessages : ''}>
                <Chip
                    classes={classes}
                    icon={icon}
                    color={hasErrors ? 'secondary' : 'primary'}
                    label={screen.name}
                    deleteIcon={<EditIcon />}
                    onDelete={editScreen}
                    variant={screen.isSelected ? 'outlined' : 'default'}
                    ref={domRef}
                />
            </Tooltip>
        </Draggable>
    );
}

export default forwardRef(Screen);
