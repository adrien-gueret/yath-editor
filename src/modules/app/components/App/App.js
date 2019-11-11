import './app.less';

import React, { useCallback } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import AppHeader from '../AppHeader';

import { Board } from 'Modules/Board';
import { GameTest, selectors as gameSelectors } from 'Modules/game';
import { actions as screenActions, selectors as screenSelectors } from 'Modules/screens';

export function App() {
    const isTesting = useSelector(gameSelectors.isTesting.get);

    const screens = useSelector(screenSelectors.list.getAsArray, shallowEqual);
    const dispatch = useDispatch();

    const addScreenHandler = useCallback((newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = screens.some(screen => screen.getSlug() === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        dispatch(screenActions.addScreen(newScreen));
        dispatch(screenActions.setEditScreen(newScreen.id));
    }, [dispatch, screens]);

    return (
        <div className="yathApp">
            <AppHeader onAddScreen={ addScreenHandler } />
            <Board />
            { isTesting && <GameTest /> }
        </div>
    );
}

export default App;