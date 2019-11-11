import React, { useCallback } from 'react';
import PropTypes from 'proptypes';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { actions as screensChoicesActions } from 'Modules/screensChoices';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ActionButtons({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(selectors.list.getEditedScreen, shallowEqual) || {};
    const onDeleteHandler = useCallback(() => {
        if (!confirm('Do you really want to delete this screen?')) {
            return;
        }

        screen.choicesIds.forEach(choiceId => dispatch(screensChoicesActions.deleteScreenChoice(choiceId)));
        dispatch(actions.deleteScreen(screenId));
        dispatch(actions.unsetEditScreen());
    }, [dispatch, screenId, screen.choicesIds]);
    const onSetStartHandler = useCallback(() => dispatch(actions.setStartScreen(screenId)), [dispatch, screenId]);
    
    if (screen.isStart) {
        return (
            <span className="screenEdit__notDeletable">This screen is the start one and can't be deleted.</span>
        );
    }

    return (
        <React.Fragment>
            <button
                onClick={onDeleteHandler}
                title="Delete screen"
                className="screenEdit__delete"
            >💣</button>
            <button
                onClick={onSetStartHandler}
                title="Mark as start screen"
                className="screenEdit__start"
            >🏁</button>
        </React.Fragment>
    );
}

ActionButtons.propTypes = propTypes;