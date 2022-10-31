import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button,
} from '@material-ui/core';

import ScreenList from '../ScreenList';

const propTypes = {
    isOpen: PropTypes.bool,
    excludedScreenId: PropTypes.string,
    defaultSelectedScreenId: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

const defaultProps = {
    isOpen: false,
    excludedScreenId: null,
    defaultSelectedScreenId: null,
};

const YathLinkDialog = ({
    isOpen,
    excludedScreenId,
    defaultSelectedScreenId,
    onSubmit,
    onClose,
}) => {
    const [selectedScreenId, setSelectedScreenId] = useState(defaultSelectedScreenId);

    return (
        <Dialog open={isOpen} aria-labelledby="custom-link-dialog">
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(selectedScreenId);
                onClose();
            }}>
                <DialogTitle id="custom-link-dialog">Configure link</DialogTitle>
                <DialogContent>
                    <DialogContentText>Select the screen to redirect the user to.</DialogContentText>
                    <ScreenList
                        excludedScreenId={excludedScreenId}
                        selectedScreenId={selectedScreenId}
                        onChange={setSelectedScreenId}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={onClose} variant="outlined">Cancel</Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={selectedScreenId === null}
                    >Confirm</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

YathLinkDialog.propTypes = propTypes;
YathLinkDialog.defaultProps = defaultProps;

export default YathLinkDialog;