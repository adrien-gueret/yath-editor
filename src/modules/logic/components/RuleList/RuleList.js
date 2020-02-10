import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import selectors from '../../selectors';
import Condition from '../Condition';

import {
    DialogContentText,
    Typography, makeStyles,
} from '@material-ui/core';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing }) => ({

}), { classNamePrefix: 'RuleList' });

export default function RuleList({ screenId }) {
    const screenRules = useSelector(state => selectors.rules.getByScreenId(state, screenId), shallowEqual) || [];

    const classes = useStyles();

    const hasRules = screenRules.length > 0;

    if (!hasRules) {
        return <Typography variant="caption">This screen has no logic rules yet.</Typography>;
    }

    return (
        <>
            <DialogContentText color="textPrimary">
                Before going to this screen:
            </DialogContentText>

            { screenRules.map((rule) => (
                <Fragment key={rule.id}>
                    <DialogContentText component="div" color="textPrimary">
                        <Condition
                            screenId={screenId}
                            onChange={(p) => console.log(p)}
                        />
                    </DialogContentText>

                    <DialogContentText component="div">
                        <strong>then </strong> do something...
                    </DialogContentText>
                </Fragment>
            )) }
        </>
    );
}

RuleList.propTypes = propTypes;
