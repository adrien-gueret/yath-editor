import './screen-edit.less';

import React, { useCallback, useState } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import ActionButtons from '../ActionButtons';
import ChoiceListContainer from '../ChoiceListContainer';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ScreenEdit({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};

    const [screenName, setScreenName] = useState(screen.name);
    const [screenContent, setScreenContent] = useState(screen.content);

    const otherScreens = useSelector(state => (
        selectors.list.getAllExceptOne(state, screenId)
    ));

    const onChangeNameHandler = useCallback(e => {
        const newScreenName = e.target.value;
        setScreenName(newScreenName);
        dispatch(actions.editScreenName(screenId, newScreenName));
    }, [dispatch, screenId]);

    const onChangeContentHandler = useCallback(e => {
        const newContent = e.target.value;
        setScreenContent(newContent);
        dispatch(actions.editScreenContent(screenId, newContent));
    }, [dispatch, screenId]);

    const onClose = useCallback(() => dispatch(actions.unsetEditScreen()), [dispatch]);

    return (
        <section className="screenEdit__overlay">
            <div className="screenEdit__content">
                <label htmlFor="screenEditName">Screen name:</label>
                <input
                    id="screenEditName"
                    value={screenName}
                    onChange={onChangeNameHandler}
                    type="text"
                />
                <label htmlFor="screenEditContent">Screen content:</label>
                <textarea
                    id="screenEditContent"
                    autoFocus={!screenContent.length}
                    onChange={onChangeContentHandler}
                    value={screenContent}
                />
                <br />

                {Boolean(otherScreens.length) && <ChoiceListContainer screenId={screenId} />}

                <footer className="screenEdit__footer">
                    <ActionButtons screenId={screenId} />
                    <button
                        onClick={onClose}
                        title="Submit"
                        className="screenEdit__submit"
                    >✔️</button>
                </footer>
            </div>
        </section>
    );
}

ScreenEdit.propTypes = propTypes;