import actionTypes from '../actions/types';
import listSelectors from '../selectors/list';

export default store => next => action => {
    if (action.type !== actionTypes.MOVE_SCREEN) {
        return next(action);
    }

    const state = store.getState();
    const allScreens = listSelectors.get(state);

    const newScreen = allScreens[action.payload.screenId].clone();
    newScreen.x = action.payload.newX;
    newScreen.y = action.payload.newY;

    const hasCollisions = Object.keys(allScreens)
        .filter(id => id !== action.payload.screenId)
        .map(id => allScreens[id])
        .some(screen => screen.doesCollied(newScreen));

    action.hasCollisions = hasCollisions;

    return next(action);
}