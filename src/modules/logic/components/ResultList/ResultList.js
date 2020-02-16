import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import { Typography, makeStyles } from '@material-ui/core';

import selectors from '../../selectors';
import Result from '../Result';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    ruleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ typography, spacing }) => ({
    operator: {
        fontWeight: typography.fontWeightBold,
        margin: spacing(2),
    },
}), { classNamePrefix: 'ResultList' });

export default function ResultList({ ruleId, screenId }) {
    const rule = useSelector(state => selectors.rules.getById(state, ruleId), shallowEqual) || [];

    const hasResults = rule.resultIds.length > 0;

    const classes = useStyles();

    if (!hasResults) {
        return <Typography variant="caption">This rule has no events yet.</Typography>;
    }

    return (
        <>
            {
                rule.resultIds.map((resultId, index) => (
                    <Fragment key={resultId}>
                        { index > 0 && <Typography className={classes.operator} color="textPrimary">and</Typography>}
                        <Result ruleId={ruleId} screenId={screenId} resultId={resultId} />
                    </Fragment>
                ))
        
            }
            <br />
        </>
    );
}

ResultList.propTypes = propTypes;
