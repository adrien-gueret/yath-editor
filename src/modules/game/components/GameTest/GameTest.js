import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import {
    Dialog, DialogActions, DialogContent, Button, makeStyles,
} from '@material-ui/core';

import { selectors as screenSelectors } from 'Modules/screens';
import { selectors as linkSelectors } from 'Modules/links';

import actions from '../../actions';

import { injectGameIntoIframe } from '../../services';

const useStyles = makeStyles(() => ({
    dialog: {
        height: '100%',
    },
    iframe: {
        width: '100%',
        height: '99%',
        border: 0,
        margin: 0,
        padding: 0,
    },
}), { classNamePrefix: 'GameTest' });

function GameTest() {
    const dispatch = useDispatch();
    const [iframeKey, setIframeKey] = useState(1);

    const screens = useSelector(screenSelectors.list.getAsArray, shallowEqual);
    const startScreen = useSelector(screenSelectors.list.getStart, shallowEqual);
    const links = useSelector(linkSelectors.list.get, shallowEqual);

    const finishTestGame = useCallback(() => dispatch(actions.finishTestGame()), [dispatch]);
    const restartGame = useCallback(() => setIframeKey(iframeKey + 1), [iframeKey, setIframeKey]);

    const initIframe = useCallback((iframe) => {
        injectGameIntoIframe(iframe, screens, links, startScreen.id);
    }, [screens, links, startScreen.id]);

    const classes = useStyles();

    return (
        <Dialog
            classes={{ paper: classes.dialog }}
            open
            maxWidth={false}
            fullWidth
        >
            <DialogContent>
                <iframe ref={initIframe} className={classes.iframe} key={iframeKey} />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={restartGame}
                    type="button"
                    variant="outlined"
                >
                    Restart
                </Button>
                <Button
                    onClick={finishTestGame}
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

export default GameTest;