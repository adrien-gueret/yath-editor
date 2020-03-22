import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux'

import {
    Dialog, DialogActions, DialogContent, Button,
    Tabs, Tab, Slide, makeStyles,
} from '@material-ui/core';

import OtherIcon from '@material-ui/icons/Build';
import CustomCSSIcon from '@material-ui/icons/Palette';

import actions from '../../actions';

import CSSConfiguration from './CSSConfiguration';
import OtherParametersConfiguration from './OtherParametersConfiguration';

const useStyles = makeStyles(({ spacing }) => ({
    tabContainer: {
        margin: spacing(1, 0, 3, 0),
        flexShrink: 0,
    },
}), { classNamePrefix: 'GameConfiguration' });

function GameConfiguration({ isOpen }) {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState('css');

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
                <Tab icon={<CustomCSSIcon />} label="Custom CSS" value="css" />
                <Tab icon={<OtherIcon />} label="Other parameters" value="other" />
            </Tabs>

            <DialogContent>
                {currentTab === 'css' && <CSSConfiguration />}
                {currentTab === 'other' && <OtherParametersConfiguration />}
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