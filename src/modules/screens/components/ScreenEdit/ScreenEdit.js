import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField,
    makeStyles, Tabs, Tab, Badge,
    InputLabel,
} from '@material-ui/core';

import LogicIcon from '@material-ui/icons/AccountTree';
import ContentIcon from '@material-ui/icons/Create';
import ImageIcon from '@material-ui/icons/Image';

import { selectors as logicSelectors } from 'Modules/logic';

import ActionButtons from '../ActionButtons';

import actions from '../../actions';
import selectors from '../../selectors';

import ScreenEditClassicContent from './ScreenEditClassicContent';
import ScreenEditImage from './ScreenEditImage';
import ScreenEditLogicContent from './ScreenEditLogicContent';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing }) => ({
    screenNameAndId: {
        display: 'flex',
        alignItems: 'center',
    },
    actions: {
        paddingRight: spacing(1),  
    },
    actionButtonContainer: {
        marginRight: 'auto',
    },
    tabContainer: {
        margin: spacing(1, 0, 3, 0),
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
    const totalLogicErrors = useSelector(state => logicSelectors.rules.getTotalErrorsByScreenId(state, screenId));
    const [currentTab, setCurrentTab] = useState('content');

    const onChangeNameHandler = useCallback(e => {
        const newScreenName = e.target.value;
        dispatch(actions.editScreenName(screenId, newScreenName));
    }, [dispatch, screenId]);

    const onClose = useCallback(() => dispatch(actions.unsetEditScreen()), [dispatch]);

    const classes = useStyles();

    return (
        <Dialog open aria-labelledby="edit-screen-dialog" fullScreen>
            <DialogTitle id="edit-screen-dialog">
                Screen configuration
                <InputLabel component="div">ID: { screenId }</InputLabel>
            </DialogTitle>

            <DialogContent key={screenId} dividers>
                <TextField
                    margin="dense"
                    label="Screen name"
                    type="text"
                    onChange={onChangeNameHandler}
                    defaultValue={screen.name}
                    variant="outlined"
                    fullWidth
                />

                <Tabs
                    className={classes.tabContainer}
                    value={currentTab}
                    onChange={(e, value) => setCurrentTab(value)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<ContentIcon />} label="Content" value="content" />
                    <Tab icon={<ImageIcon />} label="Image" value="image" />
                    <Tab icon={(
                        <Badge
                            classes={{ badge: classes.badgeCounter}}
                            badgeContent={totalLogicErrors}
                            color="error"
                            max={9}
                        >
                            <LogicIcon />
                        </Badge>
                    )} label="Logic" value="logic" />
                </Tabs>

                {currentTab === 'content' && <ScreenEditClassicContent screenId={screenId} />}
                {currentTab === 'image' && <ScreenEditImage screenId={screenId} />}
                {currentTab === 'logic' && <ScreenEditLogicContent screenId={screenId} />}

            </DialogContent>

            <DialogActions className={classes.actions}>
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