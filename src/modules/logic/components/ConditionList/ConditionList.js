import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Typography, Select, MenuItem, makeStyles } from '@material-ui/core';

import actions from '../../actions';
import selectors from '../../selectors';
import Condition from '../Condition';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    ruleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ typography, spacing }) => ({
    operator: {
        fontWeight: typography.fontWeightBold,
        margin: spacing(2),
    },
    operatorSelectorContainer: {
        margin: spacing(0, 0, 2, 0),
    },
    operatorSelector: {
        margin: spacing(0, 1),
    },
}), { classNamePrefix: 'ConditionList' });

export default function ConditionList({ ruleId, screenId }) {
    const dispatch = useDispatch();
    const rule = useSelector(state => selectors.rules.getById(state, ruleId), shallowEqual) || [];

    const updateOperator = useCallback((e) => {
        dispatch(actions.updateRuleOperator(ruleId, e.target.value));
    }, [dispatch, ruleId]);

    const hasConditions = rule.conditionIds.length > 0;

    const classes = useStyles();

    if (!hasConditions) {
        return <Typography variant="caption">Always (no conditions).</Typography>;
    }

    return (
        <>
            {
                rule.conditionIds.length > 1 && (
                    <Typography
                        display="block"
                        className={classes.operatorSelectorContainer}
                        component="div"
                    >
                        When
                        <Select
                            className={classes.operatorSelector}
                            onChange={updateOperator}
                            value={rule.operator}
                        >
                            <MenuItem value="and">all</MenuItem>
                            <MenuItem value="or">at least one</MenuItem>
                        </Select>
                        of the following { rule.operator === 'and' ? 'are' : 'is' } true:
                    </Typography>
                )
            }
            {
                rule.conditionIds.map((conditionId, index) => (
                    <Fragment key={conditionId}>
                        { index > 0 && <Typography className={classes.operator} color="textPrimary">{ rule.operator }</Typography>}
                        <Condition screenId={screenId} conditionId={conditionId} />
                    </Fragment>
                ))
        
            }
            <br />
        </>
    );
}

ConditionList.propTypes = propTypes;
