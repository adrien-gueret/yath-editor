import './board.less';

import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { selectors as screenSelectors, Screen, ScreenEdit } from 'Modules/screens';

import ArrowsBoard from '../ArrowsBoard';

function Board() {
    const editedScreenId = useSelector(screenSelectors.editedScreenId.get);
    const screens = useSelector(screenSelectors.list.getAsArray, shallowEqual);

    return (
        <section className="yathBoard">
            {
                screens.map(screen =>  (
                    <Screen key={ screen.id } screenId={screen.id} />
                ))
            }
            { editedScreenId && <ScreenEdit /> }
            <ArrowsBoard />
        </section>
    );
}

export default Board;