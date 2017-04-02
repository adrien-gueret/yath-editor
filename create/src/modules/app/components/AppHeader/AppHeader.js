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
        <button onClick={ onAddScreenClickHandler }>+</button>
    );
}

AppHeader.propTypes = propTypes;

export default AppHeader;