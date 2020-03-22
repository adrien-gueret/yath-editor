import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { DialogContentText, Link, TextField, Divider, makeStyles } from '@material-ui/core';
import NewTabIcon from '@material-ui/icons/OpenInNew';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(({ spacing }) => ({
    newTabIcon: {
        verticalAlign: 'middle',
    },
    divider: {
        margin: spacing(3, 0),
    },
}), { classNamePrefix: 'OtherParametersConfiguration' });

function OtherParametersConfiguration() {
    const dispatch = useDispatch();

    const gaId = useSelector(selectors.otherParameters.getGoogleAnalyticsId);
    const setGoogleAnalyticsId = useCallback((value) => dispatch(actions.setGoogleAnalyticsId(value)), [dispatch]);

    const classes = useStyles();

    return (
        <>
            <DialogContentText>
                You can configure here some other parameters for your game.
            </DialogContentText>
            
            <Divider className={classes.divider} />
            
            <TextField
                value={gaId || ''}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                label="Google Analytics ID"
                variant="outlined"
                placeholder="UA-123456789-1"
                helperText={(
                <>
                    You can provide a Google Analytics ID to know on which screens your players will go while playing your published game.<br />
                    <Link href="https://support.google.com/analytics/answer/1008015?hl=en" target="_blank">
                        Know more about Google Analytics <NewTabIcon fontSize="small" className={classes.newTabIcon} />
                    </Link>.
                </>
                )}
            />
        </>
    );
}

export default OtherParametersConfiguration;