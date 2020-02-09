import { selectors as gameSelectors } from 'Modules/game';

function getExportableState(state) {
    const { game, screens, links, logic } = { ...state };
    return {
        game: {
            name: game.name,
            customCSS: gameSelectors.customCSS.getExportable(state),
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
        logic,
    };
};

export default  {
    getExportableState,
}