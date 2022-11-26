import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    TextField, DialogActions, Button,
} from '@material-ui/core';

const propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};

const defaultProps = {
    isOpen: false,
    onClose() {},
    onSubmit() {},
};

const AddScreenDialog = ({ isOpen, onClose, onSubmit }) => {
    const [screenName, setScreenName] = useState('');

    function onChangeHandler(e) {
        setScreenName(e.target.value);
    };

    function onSubmitHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        onSubmit(screenName);
        setScreenName('');
    };

    return (
        <Dialog open={isOpen} aria-labelledby="add-screen-dialog" disableScrollLock>
            <form onSubmit={onSubmitHandler}>
                <DialogTitle id="add-screen-dialog">Add new screen</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter the name of the new screen.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Screen name"
                        type="text"
                        fullWidth
                        onChange={onChangeHandler}
                        value={screenName}
                        variant="outlined"
                    />

                    <DialogActions>
                        <Button type="button" onClick={onClose} variant="outlined">Cancel</Button>
                        <Button type="submit" color="primary" variant="contained">Create</Button>
                    </DialogActions>
                </DialogContent>
            </form>
        </Dialog>
    );
};

AddScreenDialog.propTypes = propTypes;
AddScreenDialog.defaultProps = defaultProps;

export default AddScreenDialog;