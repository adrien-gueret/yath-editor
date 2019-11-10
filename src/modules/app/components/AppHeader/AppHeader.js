import './appHeader.less';

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux'

import Screen from 'Modules/screens/models/Screen';
import { downloadJson, downloadHtml } from 'Modules/download';

import appSelectors from 'Modules/app/selectors';
import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';

import { deleteAllScreens, loadScreens } from 'Modules/screens/actions';
import { deleteAllScreenChoices, loadScreensChoices } from 'Modules/screensChoices/actions';
import { testGame } from 'Modules/app/actions';
import { getFullHtml } from 'Modules/game/services';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
    loadState: PropTypes.func.isRequired,
    testGame: PropTypes.func.isRequired,
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
        this.loadInput.value = '';
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

        function downloadGame() {
            const screens = screensSelectors.getAsArray(appState);
            const screensChoices = screensChoicesSelectors.get(appState);
            const startScreen = screensSelectors.getStart(appState);

            getFullHtml(screens, screensChoices, startScreen).then((html) => {
                downloadHtml('yath', html);
            });
        }

        const testGame = () => {
            this.props.testGame();
        };

        return (
            <header className="appHeader">
                <button onClick={ onAddScreenClickHandler } className="appHeader__button appHeader__button--addScreen">🔨</button>
                <button onClick={ save } className="appHeader__button appHeader__button--save">💾</button>
                <button className="appHeader__button appHeader__button--load">
                    <label htmlFor="appHeader__loadFile">📤</label>
                </button>
                <button onClick={ downloadGame } className="appHeader__button appHeader__button--download">🌍</button>
                <button onClick={ testGame } className="appHeader__button appHeader__button--test">🚩</button>
                <span className="appHeader__tooltip appHeader__tooltip--addScreen">Add screen</span>
                <span className="appHeader__tooltip appHeader__tooltip--save">Download save file</span>
                <span className="appHeader__tooltip appHeader__tooltip--download">Download HTML game</span>
                <span className="appHeader__tooltip appHeader__tooltip--load">Load save file</span>
                <span className="appHeader__tooltip appHeader__tooltip--test">Test game</span>

                <input ref={this.setLoadInput} id="appHeader__loadFile" className="appHeader__loadFile" type="file" />
            </header>
        );
    }
}

AppHeader.propTypes = propTypes;
AppHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        appState: appSelectors.getExportableState(state),
    }
};

const mapDispatchToProps = (dispatch) => ({
    loadState(newState) {
        dispatch(deleteAllScreens());
        dispatch(deleteAllScreenChoices());
        dispatch(loadScreensChoices(newState.screensChoices));
        dispatch(loadScreens(newState.screens));
    },
    testGame() {
        dispatch(testGame());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);