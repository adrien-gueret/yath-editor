import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-coy.css';

const propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
};

const defaultProps = {
    value: '',
};

const useStyles = makeStyles(() => ({
    editor: {
        backgroundColor: ['#f6f9fb', '!important'],
    },
}), { classNamePrefix: 'CSSConfiguration' });

function HTMLEditor({ value, onChange, onFocus, onBlur }) {
    const classes = useStyles();

    return (
        <Editor
            value={value}
            onValueChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            highlight={value => highlight(value, languages.html)}
            padding={10}
            textareaClassName={classes.editor}
            preClassName="language-html"
            
        />
    );
}

HTMLEditor.propTypes = propTypes;
HTMLEditor.defaultProps = defaultProps;

export default HTMLEditor;