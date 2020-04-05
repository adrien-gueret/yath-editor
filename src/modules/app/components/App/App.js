import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core';

import AppHeader from '../AppHeader';

import { Board } from 'Modules/Board';
import { GameTest, GameConfiguration, selectors as gameSelectors } from 'Modules/game';
import { selectors as screenSelectors, ScreenEdit } from 'Modules/screens';

const useStyles = makeStyles(() => ({
    '@global': {
        body: {
            margin: 0,
        },
    },
    root: {
        paddingTop: 50,
    }
}), { classNamePrefix: 'App' });

export function App() {
    const editedScreenId = useSelector(screenSelectors.editedScreenId.get);
    const isTesting = useSelector(gameSelectors.isTesting.get);
    const isConfiguring = useSelector(gameSelectors.isConfiguring.isConfiguring);

    const startScreenId = typeof isTesting === 'boolean' ? null : isTesting;

    const isDialogOpen = Boolean(editedScreenId) || isTesting || isConfiguring;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppHeader />
            <Board isDialogOpen={isDialogOpen} />
            { isTesting && <GameTest startScreenId={startScreenId} /> }

            <GameConfiguration isOpen={isConfiguring} />

            { editedScreenId && <ScreenEdit screenId={editedScreenId} /> }
        </div>
    );
}

export default App;