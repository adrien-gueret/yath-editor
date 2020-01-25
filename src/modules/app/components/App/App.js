import './app.less';

import React from 'react';
import { useSelector } from 'react-redux';

import AppHeader from '../AppHeader';

import { Board } from 'Modules/Board';
import { GameTest, GameConfiguration, selectors as gameSelectors } from 'Modules/game';
import { selectors as screenSelectors, ScreenEdit } from 'Modules/screens';

export function App() {
    const editedScreenId = useSelector(screenSelectors.editedScreenId.get);
    const isTesting = useSelector(gameSelectors.isTesting.get);
    const isConfiguring = useSelector(gameSelectors.isConfiguring.get);
    const startScreenId = typeof isTesting === 'boolean' ? null : isTesting;

   const isDialogOpen = Boolean(editedScreenId) || isTesting || isConfiguring;

    return (
        <div className="yathApp">
            <AppHeader />
            <Board isDialogOpen={isDialogOpen} />
            { isTesting && <GameTest startScreenId={startScreenId} /> }
            { isConfiguring && <GameConfiguration /> }
            { editedScreenId && <ScreenEdit screenId={editedScreenId} /> }
        </div>
    );
}

export default App;