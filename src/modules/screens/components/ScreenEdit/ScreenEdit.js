import React, { useCallback, useState } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Dialog, DialogTitle, DialogContent,
    TextField, DialogActions, Button,
} from '@material-ui/core';

import ActionButtons from '../ActionButtons';
import LinkListContainer from '../LinkListContainer';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default function ScreenEdit({ screenId }) {
    const dispatch = useDispatch();
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual) || {};

    const [screenName, setScreenName] = useState(screen.name);
    const [screenContent, setScreenContent] = useState(screen.content);

    const otherScreens = useSelector(state => (
        selectors.list.getAllExceptOne(state, screenId)
    ));

    const onChangeNameHandler = useCallback(e => {
        const newScreenName = e.target.value;
        setScreenName(newScreenName);
        dispatch(actions.editScreenName(screenId, newScreenName));
    }, [dispatch, screenId]);

    const onChangeContentHandler = useCallback(e => {
        const newContent = e.target.value;
        setScreenContent(newContent);
        dispatch(actions.editScreenContent(screenId, newContent));
    }, [dispatch, screenId]);

    const onClose = useCallback(() => dispatch(actions.unsetEditScreen()), [dispatch]);

    return (
        <Dialog open aria-labelledby="edit-screen-dialog" fullWidth maxWidth={false}>
            <DialogTitle id="edit-screen-dialog">Screen configuration</DialogTitle>
            <DialogContent dividers>
                <TextField
                    margin="dense"
                    label="Screen name"
                    type="text"
                    fullWidth
                    onChange={onChangeNameHandler}
                    value={screenName}
                    variant="outlined"
                />
                <TextField
                    margin="normal"
                    label="Screen content"
                    type="text"
                    autoFocus={!screenContent.length}
                    fullWidth
                    multiline
                    onChange={onChangeContentHandler}
                    value={screenContent}
                    variant="outlined"
                />

                { Boolean(otherScreens.length) && <LinkListContainer screenId={screenId} /> }

            </DialogContent>
            <DialogActions>
                <ActionButtons screenId={screenId} />
                <Button
                    onClick={onClose}
                    color="primary"
                    type="button"
                    variant="contained"
                >Save</Button>
            </DialogActions>
     </Dialog>
    );
}

ScreenEdit.propTypes = propTypes;