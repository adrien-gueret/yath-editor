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

import {
    REDIRECT, ADD_ITEM, REMOVE_ITEM,
} from '../../constants/results';
import RESULT_TO_VALUE_TYPE from '../../constants/resultToValueType';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    resultId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    disableRedirectToScreen: PropTypes.bool,
};

const defaultProps = {
    disableRedirectToScreen: false,
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
}), { classNamePrefix: 'Result' });

function Result({ screenId, resultId, disableRedirectToScreen }) {
    const [isConfirmDialogOpen, toggleConfirmDialogOpen] = useState(false);

    const result = useSelector(state => selectors.results.getById(state, resultId), shallowEqual) || [];
    const otherScreens = useSelector(state => (
        screenSelectors.list.getAllExceptOne(state, screenId)
    ));

    const dispatch = useDispatch();

    const onDeleteHandler = useCallback(() => dispatch(actions.deleteResult(resultId)), [dispatch, resultId]);

    const { type } = result;

    const classes = useStyles();

    const onChangeType = useCallback(({ target }) => {
        const { value } = target;
        dispatch(actions.updateResultType(resultId, value));
    }, [dispatch, resultId]);

    const onChangeScreenId = useCallback((screenId) => {
        dispatch(actions.updateResultParams(resultId, { screenId }));
    }, [dispatch, resultId]);

    const onChangeTotalItems = useCallback(({ target }) => {
        dispatch(actions.updateResultParams(resultId, {
            itemId: result.params.itemId,
            total: Number(target.value),
        }));
    }, [dispatch, result, resultId]);

    const onChangeItemId = useCallback((itemId) => {
        dispatch(actions.updateResultParams(resultId, {
            itemId,
            total: result.params.total,
        }));
    }, [dispatch, result, resultId]);

    const selectableValues = {
        screen: (
            <ScreenList
                onChange={onChangeScreenId}
                className={classes.select}
                excludedScreenId={screenId}
                selectedScreenId={result.params.screenId}
            />
        ),
        item: (
            <>
                <TextField
                    type="number"
                    className={classes.numberField}
                    onChange={onChangeTotalItems}
                    value={result.params.total}
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
                    selectedItemName={result.params.itemId}
                />
            </>
        ),
    };

    return (
        <>
            <Tooltip title="Delete event">
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
                Do you really want to delete this event?
            </ConfirmDialog>

            <Select value={type} onChange={onChangeType} className={classes.select}>
                <MenuItem value={ADD_ITEM}>Add into inventory</MenuItem>
                <MenuItem value={REMOVE_ITEM}>Remove from inventory</MenuItem>
                <MenuItem
                    value={REDIRECT}
                    disabled={disableRedirectToScreen || otherScreens.length === 0}
                >Redirect player to</MenuItem>
            </Select>
           
            { selectableValues[RESULT_TO_VALUE_TYPE[type]] }
        </>
    );
}

Result.propTypes = propTypes;
Result.defaultProps = defaultProps;

export default Result;