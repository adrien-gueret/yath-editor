import React, { useCallback, useState } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { IconButton, Tooltip, makeStyles, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FlagIcon from '@material-ui/icons/Flag';

import { actions as linkActions } from 'Modules/links';
import { ConfirmDialog } from 'Modules/utils';

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
    const [isConfirmDialogOpen, toggleConfirmDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};
    const onDeleteHandler = useCallback(() => {
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
                <IconButton onClick={() => toggleConfirmDialogOpen(true)}>
                    <DeleteIcon color="secondary" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Mark as start screen">
                <IconButton
                    onClick={onSetStartHandler}
                    className={`${classes.pushToLeft} ${classes.startScreenButton}`} 
                >
                    <FlagIcon />
                </IconButton>
            </Tooltip>
            <ConfirmDialog
                isDeletion
                open={isConfirmDialogOpen}
                onAccept={onDeleteHandler}
                onCancel={() => toggleConfirmDialogOpen(false)}
            >
                Do you really want to delete this screen?
            </ConfirmDialog>
        </React.Fragment>
    );
}

ActionButtons.propTypes = propTypes;