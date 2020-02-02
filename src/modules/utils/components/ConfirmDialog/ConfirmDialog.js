import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button,
} from '@material-ui/core';

const propTypes = {
    onCancel: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
    children: PropTypes.node,
    isDeletion: PropTypes.bool,
};

const defaultProps = {
    children: null,
    isDeletion: false,
};

function ConfirmDialog({ children, onCancel, onAccept, isDeletion, ...otherProps }) {
    return (
        <Dialog {...otherProps} fullWidth>
            <DialogTitle>Confirm action?</DialogTitle>
            <DialogContent>
                <DialogContentText>{ children }</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onCancel}
                    type="button"
                    variant="outlined"
                >Cancel</Button>
                <Button
                    onClick={onAccept}
                    color={isDeletion ? 'secondary' : 'primary'}
                    type="button"
                    variant="contained"
                >{isDeletion ? 'Delete' : 'Confirm'}</Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmDialog.propTypes = propTypes;
ConfirmDialog.defaultProps = defaultProps;

export default ConfirmDialog;