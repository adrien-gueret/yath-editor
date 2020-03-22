import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { DialogContentText, makeStyles } from '@material-ui/core';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-coy.css';

import actions from '../../actions';
import selectors from '../../selectors';

const useStyles = makeStyles(() => ({
    editor: {
        backgroundColor: ['#f6f9fb', '!important'],
    },
}), { classNamePrefix: 'CSSConfiguration' });

function CSSConfiguration() {
    const dispatch = useDispatch();

    const customCSS = useSelector(selectors.customCSS.get);
    const setCustomCSS = useCallback((value) => dispatch(actions.setCustomCSS(value)), [dispatch]);

    const classes = useStyles();

    return (
        <>
            <DialogContentText>
                The CSS below will be injected <strong>after</strong> the yath CSS file.
            </DialogContentText>
            <Editor
                value={customCSS}
                onValueChange={setCustomCSS}
                highlight={value => highlight(value, languages.css)}
                padding={10}
                textareaClassName={classes.editor}
                preClassName="language-css"
                
            />
        </>
    );
}

export default CSSConfiguration;