import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
    makeStyles, Select, MenuItem,
    Tooltip, IconButton,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

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

    const getOnChangeParamsHandler = useCallback((paramIndex = 0) => (value) => {
        const params = [...result.params];
        params[paramIndex] = value;

        dispatch(actions.updateResultParams(resultId, params));
    }, [dispatch, resultId, result]);

    const selectableValues = {
        screen: (
            <ScreenList
                onChange={getOnChangeParamsHandler()}
                className={classes.select}
                excludedScreenId={screenId}
                selectedScreenId={result.params[0]}
            />
        ),
        item: (
            <ItemList
                allowCreation
                onChange={getOnChangeParamsHandler()}
                className={classes.select}
                selectedItemName={result.params[0]}
            />
        ),
    };

    return (
        <>
            <Tooltip title="Delete rule">
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
                Do you really want to delete this result?
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