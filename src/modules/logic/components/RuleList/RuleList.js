import React, { Fragment } from 'react';
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
            <DialogContentText color="textPrimary">When player is about to go to this screen...</DialogContentText>
            { screen.logicRuleIds.map((ruleId, index) => (
                <Fragment key={ruleId}>
                    { index > 0 && <DialogContentText color="textPrimary">and</DialogContentText>}
                    <Rule ruleId={ruleId} screenId={screenId} />
                </Fragment>
            )) }
        </>
    );
}

RuleList.propTypes = propTypes;
