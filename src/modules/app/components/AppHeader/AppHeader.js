import React, { useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import slugify from 'slugify';

import {
    AppBar, IconButton, Toolbar, Tooltip, makeStyles, Typography,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, CircularProgress,
} from '@material-ui/core';

import AddScreenIcon from '@material-ui/icons/AddToQueueOutlined';
import SaveIcon from '@material-ui/icons/GetApp';
import LoadIcon from '@material-ui/icons/Publish';
import DownloadGameIcon from '@material-ui/icons/PublicOutlined';
import TestGameIcon from '@material-ui/icons/SportsEsportsOutlined';
import ConfigureGameIcon from '@material-ui/icons/SettingsOutlined';
import HelpIcon from '@material-ui/icons/HelpOutlined';
import WarningIcon from '@material-ui/icons/Warning';

import { actions as gameActions, selectors as gameSelectors } from 'Modules/game';
import { downloadJson } from 'Modules/utils';
import { actions as screenActions, useAddScreenDialog } from 'Modules/screens';
import { actions as inventoryActions } from 'Modules/inventory';
import { actions as linkActions } from 'Modules/links';
import { actions as logicActions } from 'Modules/logic';

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
    },
    gameName: {
        marginLeft: 'auto',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    loadingDialog: {
        minWidth: 330,
    },
    loadingProgress: {
        display: 'block',
        margin: 'auto',
        marginBottom: spacing(3),
    },
    warningIcon: {
        color: palette.error.main,
        verticalAlign: 'middle',
        marginRight: spacing(1),
    }
}), { classNamePrefix: 'AppHeader' });

function AppHeader({ fileToLoad = null }) {
    const [isLoadingFileDialogOpen, setIsLoadingFileDialogOpen] = useState(false);
    const [loadingFileDialogError, setLoadingFileDialogError] = useState('');

    const appState = useSelector(selectors.getExportableState, shallowEqual);
    const gameName = useSelector(gameSelectors.name.get);
    const { openAddScreenDialog, addScreenDialog } = useAddScreenDialog(true);
    const dispatch = useDispatch();
    const loadInput = useRef(null);
    const testGame = useCallback(() => dispatch(gameActions.testGame()), [dispatch]);
    const configureGame = useCallback(() => dispatch(gameActions.configureGame()), [dispatch]);
    const loadState = useCallback((newState) => {
        dispatch(logicActions.deleteAllLogic());
        dispatch(linkActions.deleteAllLinks());
        dispatch(screenActions.deleteAllScreens());
        dispatch(inventoryActions.deleteAllItems());

        dispatch(inventoryActions.loadInventory(newState.inventory));
        dispatch(logicActions.loadLogic(newState.logic));
        dispatch(linkActions.loadLinks(newState.links));
        dispatch(screenActions.loadScreens(newState.screens));

        dispatch(gameActions.renameGame(newState.game.name));

        if (newState.game.customCSS) {
            dispatch(gameActions.setCustomCSS(newState.game.customCSS));
        }

        if (newState.game.customJS) {
            dispatch(gameActions.setCustomJS(newState.game.customJS));
        }

        if (newState.game.otherParameters) {
            dispatch(gameActions.setOtherParameters(newState.game.otherParameters));
        }

        if (newState.game.globalSettings) {
            dispatch(gameActions.setGlobalSettings(newState.game.globalSettings));
        }
    }, [dispatch]);

    const loadFile = useCallback((loadEvent) => {
        loadInput.current.value = '';

        try {
            const newStoreState = JSON.parse(loadEvent.target.result);
            loadState(newStoreState);

            setIsLoadingFileDialogOpen(false);
        } catch (error) {
            setLoadingFileDialogError(`The file you want to load is malformed: ${error.message}`);
        }
    }, [loadInput.current]);

    const askForFile = useCallback(() => {
        loadInput.current.click();
    }, [loadInput.current]);

    useEffect(() => {
        if (!fileToLoad) {
            return;
        }

        setLoadingFileDialogError('');
        setIsLoadingFileDialogOpen(true);

        (async () => {
            try {
                const response = await fetch(fileToLoad);
                const state = await response.json();

                loadState(state);

                setIsLoadingFileDialogOpen(false);
            } catch(e) {
                setLoadingFileDialogError(`Can't load file "${fileToLoad}".`);
            }
        })();
    }, [fileToLoad, loadState]);

    useEffect(() => {
        if (!loadInput.current) {
            return;
        }

        const onChange = () => {
            setLoadingFileDialogError('');
            setIsLoadingFileDialogOpen(true);

            const file = loadInput.current.files[0];
            const reader = new FileReader();

            reader.onload = loadFile;

            reader.readAsText(file);
        };

        loadInput.current.addEventListener('change', onChange);

        return () => loadInput.current.removeEventListener('change', onChange);
    }, [loadInput.current]);

    const classes = useStyles();

    function save() {
        downloadJson(slugify(gameName), appState);
    }

    function downloadGame() {
        dispatch(gameActions.downloadGame());
    }

    return (
        <AppBar>
            {addScreenDialog}

            <Toolbar>
                <Tooltip title="Add screen">
                    <IconButton
                        color="inherit"
                        aria-label="Add screen"
                        onClick={() => openAddScreenDialog()}
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

                <div className={classes.separator} />

                <Typography className={classes.gameName} component="h1">{ gameName }</Typography>
               
                <Tooltip title="Configure game">
                    <IconButton
                        color="inherit"
                        aria-label="Configure game"
                        onClick={configureGame}
                    >
                        <ConfigureGameIcon fontSize="large" />
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

                <div className={classes.separator} />

                <Tooltip title="Go to wiki">
                    <IconButton 
                        color="inherit"
                        aria-label="Go to wiki"
                        component="a"
                        target="_blank"
                        href="https://github.com/adrien-gueret/yath-editor/wiki"
                    >
                        <HelpIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            
            <input ref={loadInput} className={classes.inputFile} type="file" />
    
            <Dialog classes={{ paper: classes.loadingDialog }} open={isLoadingFileDialogOpen} aria-labelledby="file-is-loading-dialog">
                <DialogTitle id="file-is-loading-dialog">File loading</DialogTitle>

                <DialogContent>
                    { Boolean(loadingFileDialogError) ? (
                        <>
                            <DialogContentText>
                                <WarningIcon className={classes.warningIcon} />
                                { loadingFileDialogError }
                            </DialogContentText>
                            <DialogActions>
                                <Button type="button" onClick={() => { setIsLoadingFileDialogOpen(false); }} color="primary" variant="contained">Close</Button>
                            </DialogActions>
                        </>
                    ): <CircularProgress className={classes.loadingProgress} />}
                </DialogContent>
            </Dialog>        
        </AppBar>
    );
}

export default AppHeader;