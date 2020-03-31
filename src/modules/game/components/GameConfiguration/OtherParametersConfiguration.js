import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { DialogContentText, Link, TextField, makeStyles, Typography } from '@material-ui/core';
import NewTabIcon from '@material-ui/icons/OpenInNew';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(({ spacing }) => ({
    newTabIcon: {
        verticalAlign: 'middle',
    },
    title: {
        margin: spacing(3, 0),
    },
    field: {
        width: 250,
    },
}), { classNamePrefix: 'OtherParametersConfiguration' });

function OtherParametersConfiguration() {
    const dispatch = useDispatch();

    const gaId = useSelector(selectors.otherParameters.getGoogleAnalyticsId);
    const cloudinary = useSelector(selectors.otherParameters.getCloudinary);
    const setGoogleAnalyticsId = useCallback((value) => dispatch(actions.setGoogleAnalyticsId(value)), [dispatch]);
    const setCloudinaryName = useCallback((value) => dispatch(actions.setCloudinaryName(value)), [dispatch]);
    const setCloudinaryPreset = useCallback((value) => dispatch(actions.setCloudinaryPreset(value)), [dispatch]);

    const classes = useStyles();

    return (
        <>
            <DialogContentText>
                You can configure here some other parameters for your game.
            </DialogContentText>
            
            <Typography className={classes.title} variant="h6">Analytics</Typography>
            
            <TextField
                className={classes.field}
                value={gaId || ''}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                label="Google Analytics ID"
                variant="outlined"
                placeholder="UA-123456789-1"
            />
            <DialogContentText>
                You can provide a Google Analytics ID to know on which screens your players will go while playing your published game.<br />
                <Link href="https://support.google.com/analytics/answer/1008015?hl=en" target="_blank">
                    Know more about Google Analytics <NewTabIcon fontSize="small" className={classes.newTabIcon} />
                </Link>.
            </DialogContentText>

            <Typography className={classes.title} variant="h6">Images uploads</Typography>

            <DialogContentText>
                For more convenience, you can use Cloudinary to upload your images directly from this editor.<br />
                To do that, you must have an account on Cloudinary. The free plan should be enough for your needs.<br />
                <Link href="https://cloudinary.com/pricing" target="_blank">
                    Know more about Cloudinary plans <NewTabIcon fontSize="small" className={classes.newTabIcon} />
                </Link>.
            </DialogContentText>

            <br />

            <TextField
                className={classes.field}
                value={cloudinary.name || ''}
                onChange={(e) => setCloudinaryName(e.target.value)}
                label="Cloud name"
                variant="outlined"
                placeholder="demo"
            />
            <DialogContentText>Your Cloudinary account cloud name.</DialogContentText>
            <br />

            <TextField
                className={classes.field}
                value={cloudinary.preset || ''}
                onChange={(e) => setCloudinaryPreset(e.target.value)}
                label="Unsigned upload preset"
                variant="outlined"
                placeholder="demo-unsigned-upload-preset"
            />
            <DialogContentText>
                The name of an unsigned upload preset that you defined for unsigned uploading to your
                { ' ' }
                <Link href="https://cloudinary.com/console/settings/upload" target="_blank">
                    Cloudinary account <NewTabIcon fontSize="small" className={classes.newTabIcon} />
                </Link>.<br />
                <Link href="https://cloudinary.com/documentation/upload_images#unsigned_upload" target="_blank">
                    Know more about Cloudindary Unsigned upload <NewTabIcon fontSize="small" className={classes.newTabIcon} />
                </Link>.
            </DialogContentText>
        </>
    );
}

export default OtherParametersConfiguration;