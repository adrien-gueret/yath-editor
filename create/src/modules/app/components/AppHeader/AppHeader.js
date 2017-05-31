import './appHeader.less';

import React, { PropTypes } from 'react';

import Screen from 'Modules/screens/models/Screen';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
};

function AppHeader({ onAddScreen }) {
    function onAddScreenClickHandler() {
        const screenName = prompt('Screen name?');

        if (screenName) {
            onAddScreen(new Screen(screenName));
        }
    }

    return (
        <header className="appHeader">
            <button onClick={ onAddScreenClickHandler } className="appHeader__button appHeader__button--addScreen">🔨</button>
            <button disabled className="appHeader__button appHeader__button--save">💾</button>
            <span className="appHeader__tooltip appHeader__tooltip--addScreen">Add screen</span>
            <span className="appHeader__tooltip appHeader__tooltip--save">Save</span>
        </header>
    );
}

AppHeader.propTypes = propTypes;

export default AppHeader;