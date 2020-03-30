import React from 'react';
import PropTypes from 'prop-types';

import { DialogContentText, Divider, makeStyles } from '@material-ui/core';

import { RuleListContainer } from 'Modules/logic';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    divider: {
        margin: spacing(2),
    },
    iconAdd: {
        marginLeft: spacing(1),
    },
}), { classNamePrefix: 'ScreenEditLogicContent' });

export default function ScreenEditLogicContent({ screenId }) {
    const classes = useStyles();
 
    return (
        <>
            <DialogContentText>The logic below will run <strong>just before</strong> going to this screen.</DialogContentText>
            <DialogContentText>You can check the visits history , manipulate player's inventory, or perform redirections to other screens.</DialogContentText>

            <Divider className={classes.divider} variant="fullWidth" />

            <RuleListContainer screenId={screenId} />
        </>
    );
}

ScreenEditLogicContent.propTypes = propTypes;