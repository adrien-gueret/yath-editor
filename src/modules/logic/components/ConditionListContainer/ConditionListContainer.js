import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import AddConditionIcon from '@material-ui/icons/AddCircle';

import ConditionModel from '../../models/Condition';
import actions from '../../actions';

import ConditionList from '../ConditionList';

const propTypes = {
    ruleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        marginTop: spacing(2),
    },
    iconAdd: {
        marginLeft: spacing(1),
    },
}), { classNamePrefix: 'ConditionListContainer' });

export default function ConditionListContainer({ ruleId, screenId }) {
    const dispatch = useDispatch();
    const addCondition = useCallback(() => (
        dispatch(actions.addCondition(new ConditionModel(), ruleId))
    ), [dispatch, ruleId]);
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <div>
               <ConditionList ruleId={ruleId} screenId={screenId} />
                <Tooltip title="Add condition">
                    <IconButton className={classes.iconAdd} onClick={addCondition}>
                        <AddConditionIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

ConditionListContainer.propTypes = propTypes;