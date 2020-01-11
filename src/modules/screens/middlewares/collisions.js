import actionTypes from '../actions/types';
import listSelectors from '../selectors/list';

const hasCollisions = (screenToCheck, allScreens) => (
    Object.keys(allScreens)
        .filter(id => id !== screenToCheck.id)
        .map(id => allScreens[id])
        .some(screen => screen.doesCollied(screenToCheck))
);

function moveScreenInterceptor(allScreens, next, action) {
    const newScreen = allScreens[action.payload.screenId].clone();
    newScreen.x = action.payload.newX;
    newScreen.y = action.payload.newY;

    action.hasCollisions = hasCollisions(newScreen, allScreens);

    return next(action);
}

function addScreenInterceptor(allScreens, next, action) {
    const { screen } = action.payload;

    while (hasCollisions(screen, allScreens)) {
        screen.x += 16;
        screen.y += 16;
    }

    return next(action);
}

function resizeScreenInterceptor(allScreens, next, action) {
    const resizedScreen = allScreens[action.payload.screenId].clone();
    const newWidth = parseInt(action.payload.newWidth, 10);
    const newHeight = parseInt(action.payload.newHeight, 10);

    resizedScreen.width = newWidth;
    resizedScreen.height = newHeight;

    while (hasCollisions(resizedScreen, allScreens)) {
        resizedScreen.x += 16;
        resizedScreen.y += 16;
    }

    action.payload.newWidth = newWidth;
    action.payload.newHeight = newHeight;
    action.payload.newX = resizedScreen.x;
    action.payload.newY = resizedScreen.y;

    return next(action);
}

const actionTypesToInterceptors = {
    [actionTypes.MOVE_SCREEN]: moveScreenInterceptor,
    [actionTypes.ADD_SCREEN]: addScreenInterceptor,
    [actionTypes.RESIZE_SCREEN]: resizeScreenInterceptor,
};

export default store => next => action => {
    if (action.type in actionTypesToInterceptors) {
        const state = store.getState();
        const allScreens = listSelectors.get(state);

        return actionTypesToInterceptors[action.type](allScreens, next, action);
    }

    return next(action);
}