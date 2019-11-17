import React from 'react';
import PropTypes from 'proptypes';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button,
} from '@material-ui/core';

const propTypes = {
    onCancel: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

function ConfirmDialog({ children, onCancel, onAccept, ...otherProps }) {
    return (
        <Dialog {...otherProps} aria-labelledby="confirm-dialog" fullWidth>
            <DialogTitle id="confirm-dialog">Confirm action?</DialogTitle>
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
                    color="secondary"
                    type="button"
                    variant="contained"
                >Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmDialog.propTypes = propTypes;
ConfirmDialog.defaultProps = defaultProps;

export default ConfirmDialog;