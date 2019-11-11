function getExportableState(state) {
    const { screens, screensChoices } = { ...state };
    return {
        screens: {
            list: screens.list,
        },
        screensChoices,
    };
};

export default  {
    getExportableState,
}