function getExportableState(state) {
    const { screens, links } = { ...state };
    return {
        screens: {
            list: Object.keys(screens.list).reduce((acc, screenId) => ({
                ...acc,
                [screenId]: {
                    ...screens.list[screenId],
                    linkIds: screens.list[screenId].linkIds.filter(linkId => Boolean(links.list[linkId])),
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