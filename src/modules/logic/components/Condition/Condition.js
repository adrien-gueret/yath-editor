import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
    makeStyles, Select, MenuItem,
    Tooltip, IconButton, TextField,
    InputAdornment,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import TimesIcon from '@material-ui/icons/Close';

import { ScreenList, selectors as screenSelectors } from 'Modules/screens';
import { ItemList } from 'Modules/inventory';
import { ConfirmDialog } from 'Modules/utils';

import CONDITION_SUBJECT_TO_VALUE_TYPE from '../../constants/conditionSubjectToValueType';
import {
    PLAYER_HAS_VISITED, PLAYER_HAS_NOT_VISITED, INVENTORY_CONTAINS, INVENTORY_DOES_NOT_CONTAIN,
} from '../../constants/conditionSubjects';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    conditionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    select: {
        margin: spacing(0, 1),
        verticalAlign: 'middle',
    },
    numberField: {
        margin: spacing(0, 1),
        verticalAlign: 'middle',
        width: 80,
    },
}), { classNamePrefix: 'Condition' });

function Condition({ screenId, conditionId }) {
    const [isConfirmDialogOpen, toggleConfirmDialogOpen] = useState(false);

    const condition = useSelector(state => selectors.conditions.getById(state, conditionId), shallowEqual) || [];
    const otherScreens = useSelector(state => (
        screenSelectors.list.getAllExceptOne(state, screenId)
    ));

    const dispatch = useDispatch();

    const onDeleteHandler = useCallback(() => dispatch(actions.deleteCondition(conditionId)), [dispatch, conditionId]);

    const { subject, params } = condition;

    const classes = useStyles();

    const onChangeSubject = useCallback(({ target }) => {
        const { value } = target;
        dispatch(actions.updateConditionSubject(conditionId, value));
    }, [dispatch, conditionId]);

    const onChangeScreenId = useCallback((screenId) => {
        dispatch(actions.updateConditionParams(conditionId, { screenId }));
    }, [dispatch, conditionId]);

    const onChangeTotalItems = useCallback(({ target }) => {
        dispatch(actions.updateConditionParams(conditionId, {
            itemId: condition.params.itemId,
            total: Number(target.value),
        }));
    }, [dispatch, condition, conditionId]);

    const onChangeItemId = useCallback((itemId) => {
        dispatch(actions.updateConditionParams(conditionId, {
            itemId,
            total: condition.params.total,
        }));
    }, [dispatch, condition, conditionId]);

    const selectableValues = {
        screen: (
            <ScreenList
                error={!condition.params.screenId}
                onChange={onChangeScreenId}
                className={classes.select}
                excludedScreenId={screenId}
                selectedScreenId={condition.params.screenId}
            >
                <MenuItem value={screenId}>this screen</MenuItem>
            </ScreenList>
        ),
        item: (
            <>
                <TextField
                    type="number"
                    className={classes.numberField}
                    onChange={onChangeTotalItems}
                    value={condition.params.total}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TimesIcon />
                          </InputAdornment>
                        ),
                      }}
                    inputProps={{
                        min: 1,
                        max: 999,
                    }}
                />
                <ItemList
                    allowCreation
                    onChange={onChangeItemId}
                    className={classes.select}
                    selectedItemName={condition.params.itemId}
                />
            </>
        ),
    };

    return (
        <>
            <Tooltip title="Delete condition">
                <IconButton onClick={() => toggleConfirmDialogOpen(true)}>
                    <DeleteIcon color="secondary" />
                </IconButton>
            </Tooltip>

            <ConfirmDialog
                isDeletion
                open={isConfirmDialogOpen}
                onAccept={onDeleteHandler}
                onCancel={() => toggleConfirmDialogOpen(false)}
            >
                Do you really want to delete this condition?
            </ConfirmDialog>

            <Select value={subject} onChange={onChangeSubject} className={classes.select}>
                <MenuItem value={PLAYER_HAS_VISITED}>player has already visited</MenuItem>
                <MenuItem value={PLAYER_HAS_NOT_VISITED}>player has not already visited</MenuItem>
                <MenuItem value={INVENTORY_CONTAINS}>inventory contains</MenuItem>
                <MenuItem value={INVENTORY_DOES_NOT_CONTAIN}>inventory does not contain</MenuItem>
            </Select>
           
            { selectableValues[CONDITION_SUBJECT_TO_VALUE_TYPE[subject]] }
        </>
    );
}

Condition.propTypes = propTypes;

export default Condition;
