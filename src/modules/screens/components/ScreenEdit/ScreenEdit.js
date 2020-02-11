import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField,
    makeStyles, Tabs, Tab, Badge,
} from '@material-ui/core';

import LogicIcon from '@material-ui/icons/AccountTree';
import ContentIcon from '@material-ui/icons/Create';

import ActionButtons from '../ActionButtons';

import actions from '../../actions';
import selectors from '../../selectors';

import ScreenEditClassicContent from './ScreenEditClassicContent';
import ScreenEditLogicContent from './ScreenEditLogicContent';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing }) => ({
    actionButtonContainer: {
        marginRight: 'auto',
    },
    tabContainer: {
        margin: spacing(1, 0, 3, 0),
    },
    typeContainer: {
        float: 'right',
    },
    typeLabel: {
        display: 'inline',
    },
    badgeCounter: {
        border: `2px solid ${palette.background.paper}`,
        padding: spacing(0, 0.5),
        right: spacing(-1),
    },
}), { classNamePrefix: 'ScreenEdit' });

export default function ScreenEdit({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};
    const [currentTab, setCurrentTab] = useState('content');

    const onChangeTypeHandler = useCallback(e => {
        const newScreenType = e.target.value;
        dispatch(actions.editScreenType(screenId, newScreenType));
    }, [dispatch, screenId]);

    const onChangeNameHandler = useCallback(e => {
        const newScreenName = e.target.value;
        dispatch(actions.editScreenName(screenId, newScreenName));
    }, [dispatch, screenId]);

    const onClose = useCallback(() => dispatch(actions.unsetEditScreen()), [dispatch]);

    const classes = useStyles();

    return (
        <Dialog open aria-labelledby="edit-screen-dialog" fullWidth maxWidth={false}>
            <DialogTitle id="edit-screen-dialog">Screen configuration</DialogTitle>

            <DialogContent key={screenId} dividers>
                <TextField
                    margin="dense"
                    label="Screen name"
                    type="text"
                    fullWidth
                    onChange={onChangeNameHandler}
                    defaultValue={screen.name}
                    variant="outlined"
                />

                <Tabs
                    className={classes.tabContainer}
                    value={currentTab}
                    onChange={(e, value) => setCurrentTab(value)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<ContentIcon />} label="Content" value="content" />
                    <Tab icon={(
                        <Badge
                            classes={{ badge: classes.badgeCounter}}
                            badgeContent={screen.logicRuleIds.length}
                            color="primary"
                            max={9}
                        >
                            <LogicIcon />
                        </Badge>
                    )} label="Logic" value="logic" />
                </Tabs>

                {currentTab === 'content' && <ScreenEditClassicContent screenId={screenId} />}
                {currentTab === 'logic' && <ScreenEditLogicContent screenId={screenId} />}

            </DialogContent>

            <DialogActions>
                <span className={classes.actionButtonContainer}>
                    <ActionButtons screenId={screenId} />
                </span>
                <Button
                    onClick={onClose}
                    color="primary"
                    type="button"
                    variant="contained"
                >Close</Button>
            </DialogActions>
        </Dialog>
    );
}

ScreenEdit.propTypes = propTypes;