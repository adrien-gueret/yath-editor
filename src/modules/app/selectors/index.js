function getExportableState(state) {
    const { screens, links } = { ...state };
    return {
        screens: {
            list: Object.keys(screens.list).reduce((acc, screenId) => ({
                ...acc,
                [screenId]: {
                    ...screens.list[screenId],
                    id: undefined,
                },
            }), {}),
        },
        links,
    };
};

export default  {
    getExportableState,
}