import React, { useCallback } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Dialog, DialogTitle, DialogContent,
    TextField, DialogActions, Button,
    makeStyles, InputLabel, Select, MenuItem,
} from '@material-ui/core';

import ActionButtons from '../ActionButtons';
import LinkListContainer from '../LinkListContainer';
import Wysiwyg from '../Wysiwyg';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(() => ({
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

    const onChangeNameHandler = useCallback(e => {
        const newScreenName = e.target.value;
        dispatch(actions.editScreenName(screenId, newScreenName));
    }, [dispatch, screenId]);

    const onChangeContentHandler = useCallback(newContent => {
        dispatch(actions.editScreenContent(screenId, newContent));
    }, [dispatch, screenId]);

    const onChangeTypeHandler = useCallback(e => {
        const newScreenType = e.target.value;
        dispatch(actions.editScreenType(screenId, newScreenType));
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

                <Wysiwyg
                    id="screen-content"
                    defaultValue={screen.content}
                    label="Screen content"
                    onChange={onChangeContentHandler}
                />
               
                { <LinkListContainer screenId={screenId} /> }

            </DialogContent>
            <DialogActions>
                <ActionButtons screenId={screenId} />
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