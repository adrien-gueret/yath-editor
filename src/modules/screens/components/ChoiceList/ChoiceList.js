import React, { useCallback } from 'react';
import PropTypes from 'proptypes';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    actions as screensChoicesActions,
    selectors as screensChoicesSelectors
} from 'Modules/screensChoices';

import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ChoiceList({ screenId }) {
    const dispatch = useDispatch();
    const screenChoices = useSelector(state => (
        screensChoicesSelectors.list.getByScreenId(state, screenId)
    ), shallowEqual);
    const otherScreens = useSelector(state => (
        selectors.list.getAllExceptOne(state, screenId)
    ));

    const getOnChangeChoiceLabelHandler = useCallback(choiceId => e => {
        const label = e.target.value;
        dispatch(screensChoicesActions.editScreenChoiceLabel(choiceId, label));
    }, [dispatch]);

    const getOnChangeChoiceTargetHandler = useCallback(choiceId => e => {
        const targetId = e.target.value;
        dispatch(screensChoicesActions.editScreenChoiceTarget(choiceId, targetId));
    }, [dispatch]);

    const getOnDeleteChoiceHandler = useCallback(choiceId => () => {
        if (!confirm('Do you really want to delete this choice?')) {
            return;
        }

        dispatch(screensChoicesActions.deleteScreenChoice(choiceId));
    }, [dispatch]);
    
    if (!screenChoices.length) {
        return <p>This screen has no choices yet.</p>;
    }

    return (
        <table>
            <thead>
            <tr>
                <th>Label</th>
                <th>Target screen</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {
                screenChoices.map(choice => (
                    <tr key={ choice.id }>
                        <td>
                            <input
                                autoFocus={!choice.label.length}
                                value={choice.label}
                                onChange={getOnChangeChoiceLabelHandler(choice.id)}
                                type="text"
                            />
                        </td>
                        <td>
                            <select
                                onChange={getOnChangeChoiceTargetHandler(choice.id)}
                                defaultValue={choice.targetScreenId || null}
                            >
                                <option>-- Select a screen --</option>
                                {
                                    otherScreens.map(otherScreen => (
                                       <option
                                           key={otherScreen.id}
                                           value={otherScreen.id}
                                       >
                                           {otherScreen.name}
                                       </option>
                                    ))
                                }
                            </select>
                        </td>
                        <td>
                            <button
                                onClick={getOnDeleteChoiceHandler(choice.id)}
                                title="Delete this choice"
                            >💣</button>
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

ChoiceList.propTypes = propTypes;
