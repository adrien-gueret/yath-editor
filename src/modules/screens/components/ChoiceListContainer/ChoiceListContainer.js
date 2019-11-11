import React, { useCallback } from 'react';
import PropTypes from 'proptypes';

import { useDispatch } from 'react-redux';

import { actions as screensChoicesActions, ScreenChoiceModel } from 'Modules/screensChoices';

import ChoiceList from '../ChoiceList';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ChoiceListContainer({ screenId }) {
    const dispatch = useDispatch();
    const addChoice = useCallback(() => (
        dispatch(screensChoicesActions.addScreenChoice(screenId, new ScreenChoiceModel()))
    ), [dispatch, screenId]);
    
    return (
        <div>
            <label>Choices:</label>
            <div>
                <ChoiceList screenId={screenId} />
                <button
                    onClick={addChoice}
                    title="Add choice"
                    className="screenEdit__addChoice"
                >🏃</button>
            </div>
        </div>
    );
}

ChoiceListContainer.propTypes = propTypes;