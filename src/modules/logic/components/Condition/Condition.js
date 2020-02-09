import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Select, MenuItem } from '@material-ui/core';

import { ScreenList } from 'Modules/screens';

import {
    PLAYER_HAS_VISITED, PLAYER_HAS_NOT_VISITED, INVENTORY_CONTAINS, INVENTORY_DOES_NOT_CONTAIN,
} from '../../constants/conditionSubjects';
import SUBJECT_TO_VALUE_TYPE from '../../constants/conditionSubjectToValueType';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    subject: PropTypes.string,
    expectedValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {
    subject: PLAYER_HAS_VISITED,
    expectedValue: undefined,
};

const useStyles = makeStyles(({ spacing }) => ({
    select: {
        margin: spacing(0, 1),
    },
}), { classNamePrefix: 'Condition' });

function Condition({ onChange, screenId, subject, expectedValue = screenId }) {
    const classes = useStyles();

    const getOnChangeHandler = prop => ({ target }) => {
        const { value } = target;
        onChange({
            subject,
            expectedValue,
            [prop]: value,
        });
    };

    const selectableValues = {
        screen: (
            <ScreenList
                className={classes.select}
                excludedScreenId={screenId}
                selectedScreenId={expectedValue}
            >
                <MenuItem value={screenId}>this screen</MenuItem>
            </ScreenList>
        ),
        item: <MenuItem value="item">an item (todo)</MenuItem>,
    };

    return (
        <React.Fragment>
            <strong>if </strong>
            <Select value={subject} onChange={getOnChangeHandler('subject')} className={classes.select}>
                <MenuItem value={PLAYER_HAS_VISITED}>player has already visited</MenuItem>
                <MenuItem value={PLAYER_HAS_NOT_VISITED}>player has not already visited</MenuItem>
                <MenuItem disabled value={INVENTORY_CONTAINS}>inventory contains</MenuItem>
                <MenuItem disabled value={INVENTORY_DOES_NOT_CONTAIN}>inventory does not contain</MenuItem>
            </Select>
           
            { selectableValues[SUBJECT_TO_VALUE_TYPE[subject]] }
        </React.Fragment>
    );
}

Condition.propTypes = propTypes;
Condition.defaultProps = defaultProps;

export default Condition;