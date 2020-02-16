import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import AddResultIcon from '@material-ui/icons/AddCircle';

import ResultModel from '../../models/Result';
import actions from '../../actions';

import ResultList from '../ResultList';

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
}), { classNamePrefix: 'ResultListContainer' });

export default function ResultListContainer({ ruleId, screenId }) {
    const dispatch = useDispatch();
    const addResult = useCallback(() => (
        dispatch(actions.addResult(new ResultModel(), ruleId))
    ), [dispatch, ruleId]);
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <div>
               <ResultList ruleId={ruleId} screenId={screenId} />
                <Tooltip title="Add event">
                    <IconButton className={classes.iconAdd} onClick={addResult}>
                        <AddResultIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

ResultListContainer.propTypes = propTypes;