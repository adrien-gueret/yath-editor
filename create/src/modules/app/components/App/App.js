import React  from 'react';
import { connect } from 'react-redux'

import AppHeader from '../AppHeader';
import Board from '../Board';

import { addScreen } from 'Modules/screens/actions';

function App({ screens, dispatch }) {
    const addScreenHandler = (newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = screens.some(screen => screen.getSlug() === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        dispatch(addScreen(newScreen));
    };

    return (
        <div className="yathApp">
            <AppHeader onAddScreen={ addScreenHandler } />
            <Board screens={ screens } />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        screens: state.screens,
    }
};


export default connect(mapStateToProps)(App);