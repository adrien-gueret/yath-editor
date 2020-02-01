import React, { useCallback } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField,
    makeStyles, InputLabel, Select, MenuItem,
} from '@material-ui/core';

import ActionButtons from '../ActionButtons';

import actions from '../../actions';
import selectors from '../../selectors';

import ScreenEditClassicContent from './ScreenEditClassicContent';
import ScreenEditLogicContent from './ScreenEditLogicContent';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(() => ({
    actionButtonContainer: {
        marginRight: 'auto',
    },
    typeContainer: {
        float: 'right',
    },
    typeLabel: {
        display: 'inline',
    },
}), { classNamePrefix: 'ScreenEdit' });

export default function ScreenEdit({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};

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
            <DialogTitle id="edit-screen-dialog">
                Screen configuration
                { !screen.isStart && (
                    <span className={classes.typeContainer}>
                        <InputLabel className={classes.typeLabel}>Type: </InputLabel>
                        <Select
                            value={screen.type}
                            onChange={onChangeTypeHandler}
                        >
                            <MenuItem value="classic">Classic</MenuItem>
                            <MenuItem value="logic">Logic</MenuItem>
                        </Select>
                    </span>
                ) }
            </DialogTitle>

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
                { screen.type === 'logic' && (
                    <ScreenEditLogicContent screenId={screenId} />
                ) }
                { screen.type === 'classic' && (
                    <ScreenEditClassicContent screenId={screenId} />
                ) }
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