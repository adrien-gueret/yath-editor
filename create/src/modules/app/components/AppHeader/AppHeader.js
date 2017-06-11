import './appHeader.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import Screen from 'Modules/screens/models/Screen';
import downloadJson from 'Modules/download';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
    appState: PropTypes.object,
};

const defaultProps = {
    appState: {},
};

function AppHeader({ onAddScreen, appState }) {
    function onAddScreenClickHandler() {
        const screenName = prompt('Screen name?');

        if (screenName) {
            onAddScreen(new Screen(screenName));
        }
    }

    function save() {
        downloadJson('yath', appState);
    }

    return (
        <header className="appHeader">
            <button onClick={ onAddScreenClickHandler } className="appHeader__button appHeader__button--addScreen">🔨</button>
            <button onClick={ save } className="appHeader__button appHeader__button--save">💾</button>
            <span className="appHeader__tooltip appHeader__tooltip--addScreen">Add screen</span>
            <span className="appHeader__tooltip appHeader__tooltip--save">Save</span>
        </header>
    );
}

AppHeader.propTypes = propTypes;
AppHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        appState: state,
    }
};

export default connect(mapStateToProps)(AppHeader);