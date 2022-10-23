import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { DialogContentText, makeStyles } from '@material-ui/core';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-coy.css';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(() => ({
    editor: {
        backgroundColor: ['#f6f9fb', '!important'],
    },
}), { classNamePrefix: 'CSSConfiguration' });

function JSConfiguration() {
    const dispatch = useDispatch();

    const customJS = useSelector(selectors.customJS.get);
    const setCustomJS = useCallback((value) => dispatch(actions.setCustomJS(value)), [dispatch]);

    const classes = useStyles();

    return (
        <>
            <DialogContentText>
                The JS below will be executed <strong>every time</strong> the player moves to a new screen.
            </DialogContentText>
            <Editor
                value={customJS}
                onValueChange={setCustomJS}
                highlight={value => highlight(value, languages.js)}
                padding={10}
                textareaClassName={classes.editor}
                preClassName="language-js"
                
            />
        </>
    );
}

export default JSConfiguration;