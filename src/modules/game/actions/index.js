import actionTypes from './types';

export default {
    testGame(startScreenId) {
        return { type: actionTypes.TEST_GAME, payload: { startScreenId } };
    },
    finishTestGame() {
        return { type: actionTypes.FINISH_TEST_GAME };
    },
    renameGame(name) {
        return { type: actionTypes.RENAME_GAME, payload: { name } };
    },
    downloadGame() {
        return { type: actionTypes.DOWNLOAD_GAME };
    },
    setCustomCSS(css) {
        return { type: actionTypes.SET_CUSTOM_CSS, payload: { css } };
    },
    configureGame(defaultTab = 'css') {
        return { type: actionTypes.CONFIGURE_GAME, payload: { defaultTab } };
    },
    finishConfigureGame() {
        return { type: actionTypes.FINISH_CONFIGURE_GAME };
    },
    setGoogleAnalyticsId(gaId) {
        return { type: actionTypes.SET_GOOGLE_ANALYTICS_ID, payload: { gaId } };
    },
    setCloudinaryName(name) {
        return { type: actionTypes.SET_CLOUDINARY_NAME, payload: { name } };
    },
    setCloudinaryPreset(preset) {
        return { type: actionTypes.SET_CLOUDINARY_PRESET, payload: { preset } };
    },
    setOtherParameters(parameters) {
        return { type: actionTypes.SET_OTHER_PARAMETERS, payload: { parameters } };
    },
    setConfigurationTab(tab) {
        return { type: actionTypes.SET_CONFIGURATION_TAB, payload: { tab } };
    },
};