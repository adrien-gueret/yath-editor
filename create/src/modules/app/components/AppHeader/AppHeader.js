import './appHeader.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import Screen from 'Modules/screens/models/Screen';
import downloadJson from 'Modules/download';

import { loadScreens } from 'Modules/screens/actions';
import { loadScreensChoices } from 'Modules/screensChoices/actions';

const propTypes = {
    loadState: PropTypes.func.isRequired,
    onAddScreen: PropTypes.func.isRequired,
    appState: PropTypes.object,
};

const defaultProps = {
    appState: {},
};

class AppHeader extends React.Component {
    constructor(props) {
        super(props);

        this.loadInput = null;
    }

    loadFile = (loadEvent) => {
        try {
            const newStoreState = JSON.parse(loadEvent.target.result);
            this.props.loadState(newStoreState);
        } catch(error) {
            alert(`The file you want to load is not a correct JSON file: ${error.message}`);
        }
    };

    setLoadInput = (ref) => {
        this.loadInput = ref;
    };

    componentDidMount() {
        this.loadInput.addEventListener('change', () => {
            const file = this.loadInput.files[0];
            const reader = new FileReader();

            reader.onload = this.loadFile;

            reader.readAsText(file);
        });
    }

    render() {
        const { onAddScreen, appState } = this.props;

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
                <button className="appHeader__button appHeader__button--load">
                    <label htmlFor="appHeader__loadFile">📤</label>
                </button>
                <span className="appHeader__tooltip appHeader__tooltip--addScreen">Add screen</span>
                <span className="appHeader__tooltip appHeader__tooltip--save">Save</span>
                <span className="appHeader__tooltip appHeader__tooltip--load">Load</span>

                <input ref={this.setLoadInput} id="appHeader__loadFile" className="appHeader__loadFile" type="file" />
            </header>
        );
    }
}

AppHeader.propTypes = propTypes;
AppHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        appState: state,
    }
};

const mapDispatchToProps = (dispatch) => ({
    loadState(newState) {
        dispatch(loadScreensChoices(newState.screensChoices));
        dispatch(loadScreens(newState.screens));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);