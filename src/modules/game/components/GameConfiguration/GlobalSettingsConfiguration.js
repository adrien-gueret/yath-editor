import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { DialogContentText, Link, TextField, makeStyles, Typography, Divider } from '@material-ui/core';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(({ spacing }) => ({
    field: {
        width: 500,
    },
}), { classNamePrefix: 'GlobalSettingsConfiguration' });

function GlobalSettingsConfiguration() {
    const dispatch = useDispatch();
    const gameName = useSelector(selectors.name.getEditable);

    const onGameNameChangeHandler = e => dispatch(actions.renameGame(e.target.value));

    const classes = useStyles();

    return (
        <>
            <DialogContentText>You can configure here some basic stuff for your game.</DialogContentText>

            <TextField
                label="Game name"
                className={classes.field}
                variant="outlined"
                value={gameName || ''}
                onChange={onGameNameChangeHandler}
                placeholder="My yath game"
            />
        </>
    );
}

export default GlobalSettingsConfiguration;