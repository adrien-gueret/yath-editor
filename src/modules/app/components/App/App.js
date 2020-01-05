import './app.less';

import React from 'react';
import { useSelector } from 'react-redux';

import AppHeader from '../AppHeader';

import { Board } from 'Modules/Board';
import { GameTest, selectors as gameSelectors } from 'Modules/game';

export function App() {
    const isTesting = useSelector(gameSelectors.isTesting.get);

    return (
        <div className="yathApp">
            <AppHeader />
            <Board />
            { isTesting && <GameTest /> }
        </div>
    );
}

export default App;