import './app.less';

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux'

import AppHeader from '../AppHeader';
import Board from '../Board';

import appSelectors from 'Modules/app/selectors';
import screensSelectors from 'Modules/screens/selectors';
import { addScreen } from 'Modules/screens/actions';
import { setEditScreen } from 'Modules/app/actions';

import GameTest from 'Modules/game/components/GameTest';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
    isGameTesting: PropTypes.bool,
    screens: PropTypes.array,
};

const defaultProps = {
    isGameTesting: false,
    screens: [],
};

export function App({ isGameTesting, screens, onAddScreen }) {
    const addScreenHandler = (newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = screens.some(screen => screen.getSlug() === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        onAddScreen(newScreen);
    };

    return (
        <div className="yathApp">
            <AppHeader onAddScreen={ addScreenHandler } />
            <Board />
            { isGameTesting && <GameTest /> }
        </div>
    );
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        isGameTesting: appSelectors.isGameTesting(state),
        screens: screensSelectors.getAsArray(state),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddScreen(screen) {
            dispatch(addScreen(screen));
            dispatch(setEditScreen(screen.id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);