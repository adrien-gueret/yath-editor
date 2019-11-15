import React, { useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'proptypes';

import { AppBar, IconButton, Toolbar, Tooltip, makeStyles } from '@material-ui/core';

import AddScreenIcon from '@material-ui/icons/AddToQueueOutlined';
import SaveIcon from '@material-ui/icons/GetApp';
import LoadIcon from '@material-ui/icons/Publish';
import DownloadGameIcon from '@material-ui/icons/PublicOutlined';
import TestGameIcon from '@material-ui/icons/SportsEsportsOutlined';

import { actions as gameActions, getFullHtml } from 'Modules/game';
import { downloadJson, downloadHtml } from 'Modules/utils';
import {
    selectors as screensSelectors,
    ScreenModel,
    actions as screenActions,
    AddScreenDialog,
} from 'Modules/screens';

import { selectors as screensChoicesSelectors, actions as screensChoicesActions } from 'Modules/screensChoices';

import selectors from '../../selectors';

const useStyles = makeStyles(({ spacing, palette }) => ({
    separator: {
        margin: spacing(0, 2),
        height: 32,
        borderRight: `2px solid ${palette.divider}`,
    },
    toRight: {
        marginLeft: 'auto',
    },
    inputFile: {
        display: 'none',
    }
}), { classNamePrefix: 'AppHeader' });

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
};

function AppHeader({ onAddScreen }) {
    const appState = useSelector(selectors.getExportableState, shallowEqual);
    const dispatch = useDispatch();
    const loadInput = useRef(null);
    const testGame = useCallback(() => dispatch(gameActions.testGame()), [dispatch]);
    const loadState = useCallback((newState) => {
        dispatch(screenActions.deleteAllScreens());
        dispatch(screensChoicesActions.deleteAllScreenChoices());
        dispatch(screensChoicesActions.loadScreensChoices(newState.screensChoices));
        dispatch(screenActions.loadScreens(newState.screens));
    }, [dispatch]);
    const [isAddScreenDialogOpen, setIsAddScreenDialogOpen] = useState(false);

    const loadFile = useCallback((loadEvent) => {
        loadInput.current.value = '';

        try {
            const newStoreState = JSON.parse(loadEvent.target.result);
            loadState(newStoreState);
        } catch(error) {
            alert(`The file you want to load is not a correct JSON file: ${error.message}`);
        }

    }, [loadInput.current]);

    const askForFile = useCallback(() => {
        loadInput.current.click();

    }, [loadInput.current]);

    useEffect(() => {
        if (!loadInput.current) {
            return;
        }

        const onChange = () => {
            const file = loadInput.current.files[0];
            const reader = new FileReader();

            reader.onload = loadFile;

            reader.readAsText(file);
        };

        loadInput.current.addEventListener('change', onChange);

        return () => loadInput.current.removeEventListener('change', onChange);
    }, [loadInput.current]);

    const classes = useStyles();

    function onAddScreenClickHandler() {
        setIsAddScreenDialogOpen(true);
    }

    const onAddScreenDialogClose = useCallback(() => {
        setIsAddScreenDialogOpen(false);
    }, [setIsAddScreenDialogOpen]);

    const onAddScreenDialogSubmit = useCallback((screenName) => {
        if (screenName) {
            onAddScreen(new ScreenModel(screenName));
        }
        onAddScreenDialogClose();
    }, [onAddScreenDialogClose]);

    function save() {
        downloadJson('yath', appState);
    }

    function downloadGame() {
        const screens = screensSelectors.list.getAsArray(appState);
        const screensChoices = screensChoicesSelectors.list.get(appState);
        const startScreen = screensSelectors.list.getStart(appState);

        getFullHtml(screens, screensChoices, startScreen).then((html) => {
            downloadHtml('yath', html);
        });
    }

    return (
        <AppBar>
            <AddScreenDialog
                isOpen={isAddScreenDialogOpen}
                onClose={onAddScreenDialogClose}
                onSubmit={onAddScreenDialogSubmit}
            />
            <Toolbar>
                <Tooltip title="Add screen">
                    <IconButton
                        color="inherit"
                        aria-label="Add screen"
                        onClick={onAddScreenClickHandler}
                    >
                        <AddScreenIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                <div className={classes.separator} />
                <Tooltip title="Download save file">
                    <IconButton
                        color="inherit"
                        aria-label="Download save file"
                        onClick={save}
                    >
                        <SaveIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Load save file">
                    <IconButton
                        color="inherit"
                        aria-label="Load save file"
                        onClick={askForFile}
                    >
                        <LoadIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="Download game as HTML file">
                    <IconButton
                        className={classes.toRight}
                        color="inherit"
                        aria-label="Download game as HTML file"
                        onClick={downloadGame} 
                    >
                        <DownloadGameIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Test game">
                    <IconButton
                        color="inherit"
                        aria-label="Test game"
                        onClick={testGame}
                    >
                        <TestGameIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <input ref={loadInput} className={classes.inputFile} type="file" />
        </AppBar>
    );
}

AppHeader.propTypes = propTypes;

export default AppHeader;