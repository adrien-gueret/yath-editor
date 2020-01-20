function getExportableState(state) {
    const { game, screens, links } = { ...state };
    return {
        game: {
            name: game.name,
        },
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