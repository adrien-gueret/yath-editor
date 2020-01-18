import actions from '../actions';
import actionTypes from '../actions/types';
import listSelectors from '../selectors/list';

export default store => next => action => {
    if (action.type === actionTypes.MOVE_SCREENS) {
        action.payload.screenIds.forEach((screenId) => {
            store.dispatch(actions.moveScreen(screenId, action.payload.deltaX, action.payload.deltaY, true));
        });
        return;
    }

    if (action.type === actionTypes.MOVE_SCREEN && action.payload.isDelta) {
        const state = store.getState();
        const allScreens = listSelectors.get(state);
        const newScreen = allScreens[action.payload.screenId].clone();
        const { x, y } = newScreen.getCoordinates();
    
        action.payload.newX += x;
        action.payload.newY += y;
    }

    return next(action);
}