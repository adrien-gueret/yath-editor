import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { InputLabel, IconButton, Tooltip, makeStyles } from '@material-ui/core';
import AddLinkIcon from '@material-ui/icons/Link';

import { actions as linkActions, Link } from 'Modules/links';

import LinkList from '../LinkList';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        marginTop: spacing(2),
    },
    iconAdd: {
        marginLeft: spacing(1),
    },
}), { classNamePrefix: 'LinkListContainer' });

export default function LinkListContainer({ screenId }) {
    const dispatch = useDispatch();
    const addLink = useCallback(() => (
        dispatch(linkActions.addLink(screenId, new Link()))
    ), [dispatch, screenId]);
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <InputLabel>Links to other screens:</InputLabel>
            <div>
                <LinkList screenId={screenId} />
                <Tooltip title="Add link">
                    <IconButton className={classes.iconAdd} onClick={addLink}>
                        <AddLinkIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

LinkListContainer.propTypes = propTypes;