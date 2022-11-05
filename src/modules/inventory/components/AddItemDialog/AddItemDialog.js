import React, { useState } from 'react';
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

const AddItemDialog = ({ isOpen, onClose, onSubmit }) => {
    const [itemName, setItemName] = useState('');

    function onChangeHandler(e) {
        setItemName(e.target.value);
    };

    function onSubmitHandler(e) {
        e.preventDefault();
        onSubmit(itemName);
        setItemName('');
    };

    return (
        <Dialog open={isOpen} aria-labelledby="add-item-dialog">
            <form onSubmit={onSubmitHandler}>
                <DialogTitle id="add-item-dialog">Add new inventory item</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter the name of the new item.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Item name"
                        type="text"
                        fullWidth
                        onChange={onChangeHandler}
                        value={itemName}
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

AddItemDialog.propTypes = propTypes;
AddItemDialog.defaultProps = defaultProps;

export default AddItemDialog;