import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import AlternativeContentListContainer from '../AlternativeContentListContainer';
import LinkListContainer from '../LinkListContainer';
import Wysiwyg from '../Wysiwyg';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ScreenEditClassicContent({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};

    const onChangeContentHandler = useCallback(newContent => {
        dispatch(actions.editScreenContent(screenId, newContent));
    }, [dispatch, screenId]);

    return (
        <React.Fragment>
            <Wysiwyg
                id="screen-content"
                screenId={screenId}
                defaultValue={screen.content}
                label="Screen content"
                onChange={onChangeContentHandler}
            />
            
            <AlternativeContentListContainer screenId={screenId} />

            <LinkListContainer screenId={screenId} />
        </React.Fragment>
    );
}

ScreenEditClassicContent.propTypes = propTypes;