import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import {
    Dialog, DialogActions, DialogContent, Button, makeStyles,
} from '@material-ui/core';

import { selectors as screenSelectors } from 'Modules/screens';
import { selectors as linkSelectors } from 'Modules/links';

import actions from '../../actions';

const useStyles = makeStyles(() => ({
   
}), { classNamePrefix: 'GameConfiguration' });

function GameConfiguration() {
    const dispatch = useDispatch();

    const finishConfigureGame = useCallback(() => dispatch(actions.finishConfigureGame()), [dispatch]);

    const classes = useStyles();

    return (
        <Dialog open>
            <DialogContent>
                Coucou
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={finishConfigureGame}
                    color="primary"
                    type="button"
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GameConfiguration;