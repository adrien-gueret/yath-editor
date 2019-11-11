import './board.less';

import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import screensSelectors from 'Modules/screens/selectors';
import appSelectors from 'Modules/app/selectors';
import ScreenEdit from 'Modules/screens/components/ScreenEdit';
import Screen from 'Modules/screens/components/Screen';
import ArrowsBoard from '../ArrowsBoard';

function Board() {
    const editScreenId = useSelector(appSelectors.getEditScreenId);
    const screens = useSelector(screensSelectors.getAsArray, shallowEqual);

    return (
        <section className="yathBoard">
            {
                screens.map(screen =>  (
                    <Screen key={ screen.id } screenId={screen.id} />
                ))
            }
            { editScreenId && <ScreenEdit /> }
            <ArrowsBoard />
        </section>
    );
}

export default Board;