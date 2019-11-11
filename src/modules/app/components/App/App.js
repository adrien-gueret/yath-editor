import './app.less';

import React, { useCallback } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import AppHeader from '../AppHeader';
import Board from '../Board';

import appSelectors from 'Modules/app/selectors';
import screensSelectors from 'Modules/screens/selectors';
import { addScreen } from 'Modules/screens/actions';
import { setEditScreen } from 'Modules/app/actions';

import GameTest from 'Modules/game/components/GameTest';

export function App() {
    const isGameTesting = useSelector(appSelectors.isGameTesting);
    const screens = useSelector(screensSelectors.getAsArray, shallowEqual);
    const dispatch = useDispatch();

    const addScreenHandler = useCallback((newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = screens.some(screen => screen.getSlug() === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        dispatch(addScreen(newScreen));
        dispatch(setEditScreen(newScreen.id));
    }, [dispatch, screens]);

    return (
        <div className="yathApp">
            <AppHeader onAddScreen={ addScreenHandler } />
            <Board />
            { isGameTesting && <GameTest /> }
        </div>
    );
}

export default App;