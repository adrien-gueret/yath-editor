import './appHeader.less';

import React, { useCallback, useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'proptypes';

import { actions as gameActions, getFullHtml } from 'Modules/game';
import { downloadJson, downloadHtml } from 'Modules/utils';
import {
    selectors as screensSelectors,
    ScreenModel,
    actions as screenActions
} from 'Modules/screens';

import screensChoicesSelectors from 'Modules/screensChoices/selectors';
import { deleteAllScreenChoices, loadScreensChoices } from 'Modules/screensChoices/actions';

import selectors from '../../selectors';

const propTypes = {
    onAddScreen: PropTypes.func.isRequired,
};

function AppHeader({ onAddScreen }) {
    const appState = useSelector(selectors.getExportableState, shallowEqual);
    const dispatch = useDispatch();
    const loadInput = useRef(null);
    const testGame = useCallback(() => dispatch(gameActions.testGame()), [dispatch]);
    const loadState = useCallback((newState) => {
        dispatch(screenActions.deleteAllScreens());
        dispatch(deleteAllScreenChoices());
        dispatch(loadScreensChoices(newState.screensChoices));
        dispatch(screenActions.loadScreens(newState.screens));
    }, [dispatch]);

    const loadFile = useCallback((loadEvent) => {
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
            onAddScreen(new ScreenModel(screenName));
        }
    }

    function save() {
        downloadJson('yath', appState);
    }

    function downloadGame() {
        const screens = screensSelectors.list.getAsArray(appState);
        const screensChoices = screensChoicesSelectors.get(appState);
        const startScreen = screensSelectors.list.getStart(appState);

        getFullHtml(screens, screensChoices, startScreen).then((html) => {
            downloadHtml('yath', html);
        });
    }

    return (
        <header className="appHeader">
            <button onClick={onAddScreenClickHandler} className="appHeader__button appHeader__button--addScreen">🔨</button>
            <button onClick={save} className="appHeader__button appHeader__button--save">💾</button>
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