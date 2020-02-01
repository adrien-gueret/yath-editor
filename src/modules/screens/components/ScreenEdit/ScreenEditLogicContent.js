import React, { useCallback } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ScreenEditLogicContent({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};

    const onChangeNameHandler = useCallback(e => {
        const newScreenName = e.target.value;
        dispatch(actions.editScreenName(screenId, newScreenName));
    }, [dispatch, screenId]);

    const onChangeContentHandler = useCallback(newContent => {
        dispatch(actions.editScreenContent(screenId, newContent));
    }, [dispatch, screenId]);

    return (
        <React.Fragment>
            <p>TODO: LOGIC</p>
        </React.Fragment>
    );
}

ScreenEditLogicContent.propTypes = propTypes;