import { selectors as gameSelectors } from 'Modules/game';

const removeCollectionIds = collection => (
    Object.keys(collection).reduce((acc, id) => ({
        ...acc,
        [id]: {
            ...collection[id],
            id: undefined,
        },
    }), {})
);

function getExportableState(state) {
    const { game, screens, links, logic, inventory } = { ...state };
    return {
        game: {
            name: game.name,
            customCSS: gameSelectors.customCSS.getExportable(state),
            customJS: gameSelectors.customJS.getExportable(state),
            otherParameters: gameSelectors.otherParameters.get(state),
            globalSettings: gameSelectors.globalSettings.get(state),
        },
        screens: {
            list: removeCollectionIds(screens.list),
        },
        links: {
            list: removeCollectionIds(links.list),
        },
        logic: {
            rules: removeCollectionIds(logic.rules),
            conditions: removeCollectionIds(logic.conditions),
            results: removeCollectionIds(logic.results),
        },
        inventory: {
            items: removeCollectionIds(inventory.items),
        },
    };
};

export default  {
    getExportableState,
}