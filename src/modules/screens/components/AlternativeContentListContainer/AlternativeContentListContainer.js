import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { InputLabel, IconButton, Tooltip, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';

import actions from '../../actions';

import AlternativeContentList from '../AlternativeContentList';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing, shadows, palette, typography }) => {
    console.log(typography);
    return {
        root: {
            marginTop: spacing(2),
        },
        iconAdd: {
            marginLeft: spacing(1),
        },
        iconHelp: {
            verticalAlign: 'middle',
            cursor: 'help',
            marginLeft: spacing(0.5),
        },
        helpTooltip: {
            ...typography.body2,
            color: palette.text.primary,
            backgroundColor: palette.background.paper,
            boxShadow: shadows[1],
        }
    };
}, { classNamePrefix: 'AlternativeContentListContainer' });

export default function AlternativeContentListContainer({ screenId }) {
    const dispatch = useDispatch();
    const addAlternativeContent = useCallback(() => (
        dispatch(actions.addAlternativeScreenContent(screenId))
    ), [dispatch, screenId]);
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <InputLabel>
                Alternative content:
                <Tooltip
                    arrow
                    placement="right"
                    title={`Alternative content can be displayed instead of the above screen content according to some conditions you define under the "Logic" tab.`}
                    classes={{ tooltip: classes.helpTooltip}}
                >
                    <HelpIcon size="small" className={classes.iconHelp} />
                </Tooltip>
            </InputLabel>
            <div>
                <AlternativeContentList screenId={screenId} />
                <Tooltip title="Add alternative content">
                    <IconButton className={classes.iconAdd} onClick={addAlternativeContent}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

AlternativeContentListContainer.propTypes = propTypes;