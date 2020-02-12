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
    ruleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing }) => ({

}), { classNamePrefix: 'Rule' });

export default function Rule({ ruleId, screenId }) {
    const rule = useSelector(state => selectors.rules.getById(state, ruleId), shallowEqual) || [];

    const classes = useStyles();

    return (
        <>
           <DialogContentText component="div" color="textPrimary">
                <Condition
                    screenId={screenId}
                    onChange={(p) => console.log(p)}
                />
            </DialogContentText>

            <DialogContentText component="div">
                <strong>then </strong> do something...
            </DialogContentText>
        </>
    );
}

Rule.propTypes = propTypes;
