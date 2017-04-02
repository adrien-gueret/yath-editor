import React from 'react';

import Screen from 'Modules/screens/models/Screen';
import AppHeader from '../AppHeader';
import Board from '../Board';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            screens: [ new Screen('First screen') ]
        };
    }

    addScreenHandler = (newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = this.state.screens.some(screen => screen.getSlug() === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        this.setState((prevState) => ({
            screens: [ ...prevState.screens, newScreen],
        }));
    };

    render() {
        return (
            <div className="yathApp">
                <AppHeader onAddScreen={ this.addScreenHandler } />
                <Board screens={ this.state.screens } />
            </div>
        );
    }
}

export default App;