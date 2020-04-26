import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { DialogContentText, TextField, Typography, makeStyles, Divider } from '@material-ui/core';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(({ spacing }) => ({
    field: {
        width: 500,
        margin: spacing(2),
    },
    title: {
        margin: spacing(3, 0),
    },
    divider: {
        margin: spacing(4),
    },
}), { classNamePrefix: 'GlobalSettingsConfiguration' });

function GlobalSettingsConfiguration() {
    const dispatch = useDispatch();
    const gameName = useSelector(selectors.name.getEditable);
    const author = useSelector(selectors.globalSettings.getAuthor);
    const description = useSelector(selectors.globalSettings.getDescription);
    const thumbnail = useSelector(selectors.globalSettings.getThumbnail);

    const onGameNameChangeHandler = e => dispatch(actions.renameGame(e.target.value));
    const onAuthorNameChangeHandler = e => dispatch(actions.setAuthor(e.target.value));
    const onDescriptionChangeHandler = e => dispatch(actions.setGameDescription(e.target.value));

    const classes = useStyles();

    return (
        <>
            <DialogContentText>You can configure here some basic stuff for your game.</DialogContentText>

            <Divider className={classes.divider} />

            <Typography className={classes.title} variant="h6">Global information</Typography>

            <TextField
                label="Game name"
                className={classes.field}
                variant="outlined"
                value={gameName || ''}
                onChange={onGameNameChangeHandler}
                placeholder="My yath game"
                helperText="Will be used as page title"
            />

            <TextField
                label="Short game description"
                className={classes.field}
                variant="outlined"
                value={description || ''}
                onChange={onDescriptionChangeHandler}
                placeholder="Discover my game! Will you beat it?"
                helperText="A few words description used for SEO purpose"
            />

            <TextField
                label="Author name"
                className={classes.field}
                variant="outlined"
                value={author || ''}
                onChange={onAuthorNameChangeHandler}
                placeholder="Your name, probably"
                helperText="Will be used for meta data"
            />

            <Divider className={classes.divider} />

            <Typography className={classes.title} variant="h6">???</Typography>

            { thumbnail }
        </>
    );
}

export default GlobalSettingsConfiguration;