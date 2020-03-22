import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux'

import {
    Dialog, DialogActions, DialogContent, Button,
    Tabs, Tab, makeStyles,
} from '@material-ui/core';

import CustomCSSIcon from '@material-ui/icons/Palette';

import actions from '../../actions';

import CSSConfiguration from './CSSConfiguration';

const useStyles = makeStyles(() => ({
   
}), { classNamePrefix: 'GameConfiguration' });

function GameConfiguration() {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState('css');

    const finishConfigureGame = useCallback(() => dispatch(actions.finishConfigureGame()), [dispatch]);

    const classes = useStyles();

    return (
        <Dialog open maxWidth={false} fullWidth>
            <Tabs
                className={classes.tabContainer}
                value={currentTab}
                onChange={(e, value) => setCurrentTab(value)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab icon={<CustomCSSIcon />} label="Custom CSS" value="css" />
            </Tabs>

            <DialogContent>
                {currentTab === 'css' && <CSSConfiguration />}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={finishConfigureGame}
                    color="primary"
                    type="button"
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GameConfiguration;