import React, { useCallback } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { IconButton, Tooltip, makeStyles, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { actions as linkActions } from 'Modules/links';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    pushToLeft: {
        marginRight: 'auto',
    },
    onDeletableMessage: {
        marginLeft: spacing(2),
    },
    startScreenButton: {
        fontSize: '1rem',
    },
}), { classNamePrefix: 'ActionButtons' });

export default function ActionButtons({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};
    const onDeleteHandler = useCallback(() => {
        if (!confirm('Do you really want to delete this screen?')) {
            return;
        }

        screen.linkIds.forEach(linkId => dispatch(linkActions.deleteLink(linkId)));
        dispatch(actions.deleteScreen(screenId));
        dispatch(actions.unsetEditScreen());
    }, [dispatch, screenId, screen.linkIds]);
    const onSetStartHandler = useCallback(() => dispatch(actions.setStartScreen(screenId)), [dispatch, screenId]);
    
    const classes = useStyles();

    if (screen.isStart) {
        return (
            <Typography
                variant="caption"
                className={`${classes.pushToLeft} ${classes.onDeletableMessage}`}
            >
                This screen is the start one and can't be deleted.
            </Typography>
        );
    }

    return (
        <React.Fragment>
            <Tooltip title="Delete screen">
                <IconButton onClick={onDeleteHandler}>
                    <DeleteIcon color="secondary" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Mark as start screen">
                <IconButton
                    onClick={onSetStartHandler}
                    className={`${classes.pushToLeft} ${classes.startScreenButton}`} 
                >🏁</IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

ActionButtons.propTypes = propTypes;