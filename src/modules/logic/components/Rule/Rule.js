import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Card, CardContent, CardActions, makeStyles,
    Tooltip, IconButton,
    Stepper, Step, StepLabel, StepContent,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import AlgoIcon from '@material-ui/icons/CallSplit';
import ResultsIcon from '@material-ui/icons/Directions';

import { ConfirmDialog } from 'Modules/utils';

import actions from '../../actions';
import selectors from '../../selectors';

import ConditionListContainer from '../ConditionListContainer';
import ResultListContainer from '../ResultListContainer';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    ruleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        margin: spacing(2, 0),
    },
    actions: {
        float: 'right',
    },
}), { classNamePrefix: 'Rule' });

export default function Rule({ ruleId, screenId }) {
    const [isConfirmDialogOpen, toggleConfirmDialogOpen] = useState(false);
    const dispatch = useDispatch();

    const results = useSelector(state => selectors.results.getByRuleId(state, ruleId), shallowEqual) || [];

    const onDeleteHandler = useCallback(() => dispatch(actions.deleteRule(ruleId)), [dispatch, ruleId]);

    const classes = useStyles();

    const hasResultsError = useSelector(state => selectors.results.hasErrorsFromRuleId(state, ruleId));
    const stepLabelResultsOtherProps = hasResultsError ? {} : { icon:  <ResultsIcon color="primary" /> };

    const hasResults = results.length > 0;
    const conditionStepTitle = hasResults ? 'When the above should run?' : 'Add event from above to be able to add some conditions.';

    const hasConditionsError = useSelector(state => selectors.conditions.hasErrorsFromRuleId(state, ruleId));
    const stepLabelConditionsOtherProps = hasConditionsError ? {} : { icon:  <AlgoIcon color={hasResults ? 'primary' : 'disabled'} /> };

    return (
        <Card className={classes.root}>
            <CardActions className={classes.actions} disableSpacing>
                <Tooltip title="Delete rule">
                    <IconButton onClick={() => toggleConfirmDialogOpen(true)}>
                        <DeleteIcon color="secondary" />
                    </IconButton>
                </Tooltip>
            </CardActions>

            <CardContent>
                <Stepper orientation="vertical">
                    <Step active>
                        <StepLabel
                            error={hasResultsError}
                            {...stepLabelResultsOtherProps}
                        >
                            What to do?
                        </StepLabel>
                        <StepContent>
                            <ResultListContainer ruleId={ruleId} screenId={screenId} />
                        </StepContent>
                    </Step>
                    <Step active={hasResults} disabled={!hasResults}>
                        <StepLabel
                            error={hasConditionsError}
                            {...stepLabelConditionsOtherProps}
                        >
                            { conditionStepTitle }
                        </StepLabel>
                        <StepContent>
                            <ConditionListContainer ruleId={ruleId} screenId={screenId} />
                        </StepContent>
                    </Step>
                </Stepper>
            </CardContent>

            <ConfirmDialog
                isDeletion
                open={isConfirmDialogOpen}
                onAccept={onDeleteHandler}
                onCancel={() => toggleConfirmDialogOpen(false)}
            >
                Do you really want to delete this rule?
            </ConfirmDialog>
        </Card>
    );
}

Rule.propTypes = propTypes;
