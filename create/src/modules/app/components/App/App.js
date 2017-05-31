import './app.less';

import React, { PropTypes }  from 'react';
import { connect } from 'react-redux'

import AppHeader from '../AppHeader';
import Board from '../Board';

import screensSelectors from 'Modules/screens/selectors';
import { addScreen } from 'Modules/screens/actions';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
    screens: PropTypes.array,
};

const defaultProps = {
    screens: [],
};

export function App({ screens, onAddScreen }) {
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
        </div>
    );
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        screens: screensSelectors.getAsArray(state),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddScreen(screen) {
            dispatch(addScreen(screen));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);