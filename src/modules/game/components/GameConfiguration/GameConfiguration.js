import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import {
    Dialog, DialogActions, DialogContent, Button,
    Tabs, Tab, Slide, makeStyles,
} from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Build';
import ExternalToolsIcon from '@material-ui/icons/Extension';
import CustomCSSIcon from '@material-ui/icons/Palette';

import actions from '../../actions';
import selectors from '../../selectors';

import CSSConfiguration from './CSSConfiguration';
import GlobalSettingsConfiguration from './GlobalSettingsConfiguration';
import ExternalToolsConfiguration from './ExternalToolsConfiguration';

const useStyles = makeStyles(({ spacing }) => ({
    tabContainer: {
        margin: spacing(1, 0, 3, 0),
        flexShrink: 0,
    },
}), { classNamePrefix: 'GameConfiguration' });

function GameConfiguration({ isOpen }) {
    const dispatch = useDispatch();
    
    const currentTab = useSelector(selectors.isConfiguring.getDefaultTab);

    const setCurrentTab = useCallback((tab) => dispatch(actions.setConfigurationTab(tab)), [dispatch]);
    const finishConfigureGame = useCallback(() => dispatch(actions.finishConfigureGame()), [dispatch]);

    const classes = useStyles();

    return (
        <Dialog open={isOpen} fullScreen TransitionComponent={Slide}>
            <Tabs
                className={classes.tabContainer}
                value={currentTab}
                onChange={(e, value) => setCurrentTab(value)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab icon={<SettingsIcon />} label="Global settings" value="global" />
                <Tab icon={<CustomCSSIcon />} label="Custom CSS" value="css" />
                <Tab icon={<ExternalToolsIcon />} label="External tools" value="externalTools" />
            </Tabs>

            <DialogContent>
                {currentTab === 'global' && <GlobalSettingsConfiguration />}
                {currentTab === 'css' && <CSSConfiguration />}
                {currentTab === 'externalTools' && <ExternalToolsConfiguration />}
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