import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
    makeStyles, Select, MenuItem,
    Tooltip, IconButton, TextField,
    InputAdornment, Typography,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import TimesIcon from '@material-ui/icons/Close';

import { ScreenList } from 'Modules/screens';
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

const useStyles = makeStyles(({ typography, spacing }) => ({
    operator: {
        fontWeight: typography.fontWeightBold,
        display: 'inline',
    },
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
            itemId: params.itemId,
            operator: paramas.operator,
            total: Number(target.value),
        }));
    }, [dispatch, params, conditionId]);

    const onChangeOperator = useCallback(({ target }) => {
        dispatch(actions.updateConditionParams(conditionId, {
            itemId: params.itemId,
            operator: target.value,
            total: params.total,
        }));
    }, [dispatch, params, conditionId]);

    const onChangeItemId = useCallback((itemId) => {
        dispatch(actions.updateConditionParams(conditionId, {
            itemId,
            operator: params.operator,
            total: params.total,
        }));
    }, [dispatch, params, conditionId]);

    const selectableValues = {
        screen: (
            <ScreenList
                error={!params.screenId}
                onChange={onChangeScreenId}
                className={classes.select}
                excludedScreenId={screenId}
                selectedScreenId={params.screenId}
            >
                <MenuItem value={screenId}>this screen</MenuItem>
            </ScreenList>
        ),
        item: (
            <>
                <Select value={params.operator} onChange={onChangeOperator} className={classes.select}>
                    <MenuItem value="===">exactly</MenuItem>
                    <MenuItem value="<">less than</MenuItem>
                    <MenuItem value=">">more than</MenuItem>
                </Select>
                <TextField
                    type="number"
                    className={classes.numberField}
                    onChange={onChangeTotalItems}
                    value={params.total}
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
                    selectedItemName={params.itemId}
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

            <Typography className={classes.operator}>if</Typography>

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
