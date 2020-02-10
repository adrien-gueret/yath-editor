import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import AddRuleIcon from '@material-ui/icons/PostAdd';

import RuleModel from '../../models/Rule';
import actions from '../../actions';

import RuleList from '../RuleList';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        marginTop: spacing(2),
    },
    iconAdd: {
        marginLeft: spacing(1),
    },
}), { classNamePrefix: 'RuleListContainer' });

export default function RuleListContainer({ screenId }) {
    const dispatch = useDispatch();
    const addRule = useCallback(() => (
        dispatch(actions.addRule(new RuleModel(), screenId))
    ), [dispatch, screenId]);
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <div>
                <RuleList screenId={screenId} />
                <Tooltip title="Add rule">
                    <IconButton className={classes.iconAdd} onClick={addRule}>
                        <AddRuleIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

RuleListContainer.propTypes = propTypes;