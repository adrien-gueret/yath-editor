import './appHeader.less';

import React, { useCallback, useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'proptypes';

import Screen from 'Modules/screens/models/Screen';
import { downloadJson, downloadHtml } from 'Modules/download';

import appSelectors from 'Modules/app/selectors';
import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';

import { deleteAllScreens, loadScreens } from 'Modules/screens/actions';
import { deleteAllScreenChoices, loadScreensChoices } from 'Modules/screensChoices/actions';
import { testGame as testGameAction } from 'Modules/app/actions';
import { getFullHtml } from 'Modules/game/services';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
};

function AppHeader({ onAddScreen }) {
    const appState = useSelector(appSelectors.getExportableState,shallowEqual);
    const dispatch = useDispatch();
    const loadInput = useRef(null);
    const testGame = useCallback(() => dispatch(testGameAction()), [dispatch]);
    const loadState = useCallback((newState) => {
        dispatch(deleteAllScreens());
        dispatch(deleteAllScreenChoices());
        dispatch(loadScreensChoices(newState.screensChoices));
        dispatch(loadScreens(newState.screens));
    }, [dispatch]);

    const loadFile = useCallback(() => {
        loadInput.current.value = '';

        try {
            const newStoreState = JSON.parse(loadEvent.target.result);
            loadState(newStoreState);
        } catch(error) {
            alert(`The file you want to load is not a correct JSON file: ${error.message}`);
        }

    }, [loadInput.current]);

    useEffect(() => {
        if (!loadInput.current) {
            return;
        }

        const onChange = () => {
            const file = loadInput.current.files[0];
            const reader = new FileReader();

            reader.onload = loadFile;

            reader.readAsText(file);
        };

        loadInput.current.addEventListener('change', onChange);

        return () => loadInput.current.removeEventListener('change', onChange);
    }, [loadInput.current]);

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

            <input ref={loadInput} id="appHeader__loadFile" className="appHeader__loadFile" type="file" />
        </header>
    );
}

AppHeader.propTypes = propTypes;

export default AppHeader;