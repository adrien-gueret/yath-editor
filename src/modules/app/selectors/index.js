function getExportableState(state) {
    const { screens, links } = { ...state };
    return {
        screens: {
            list: screens.list,
        },
        links,
    };
};

export default  {
    getExportableState,
}