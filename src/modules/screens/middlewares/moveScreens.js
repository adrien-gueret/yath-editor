import actions from '../actions';
import actionTypes from '../actions/types';

export default store => next => action => {
    if (action.type === actionTypes.MOVE_SCREENS) {
        action.payload.screenIds.forEach((screenId) => {
            store.dispatch(actions.moveScreen(screenId, action.payload.deltaX, action.payload.deltaY, true));
        });
        return;
    }

    return next(action);
}