import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import { selectors } from 'Modules/screens';
import Rule from '../Rule';

import { DialogContentText, Typography } from '@material-ui/core';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function RuleList({ screenId }) {
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || [];

    const hasRules = screen.logicRuleIds.length > 0;

    if (!hasRules) {
        return <Typography variant="caption">This screen has no logic rules yet.</Typography>;
    }

    return (
        <>
            <DialogContentText color="textPrimary">
                Before going to this screen:
            </DialogContentText>

            { screen.logicRuleIds.map(ruleId => <Rule key={ruleId} ruleId={ruleId} screenId={screenId} />) }
        </>
    );
}

RuleList.propTypes = propTypes;
