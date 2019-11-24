import React, { useState, useRef, useEffect, useCallback } from 'react';
import Proptypes from 'proptypes';
import ReactDOM from 'react-dom';

import { InputLabel, makeStyles, Toolbar, Tooltip, IconButton } from '@material-ui/core';

import NotchedOutline from '@material-ui/core/OutlinedInput/NotchedOutline';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatUnderline from '@material-ui/icons/FormatUnderlined';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

const propTypes = {
    id: Proptypes.string.isRequired,
    label: Proptypes.string.isRequired,
    defaultValue: Proptypes.string,
    onChange: Proptypes.func,
};

const defaultProps = {
    defaultValue: undefined,
    onChange() {},
};

const useStyles = makeStyles(({ palette, shape, spacing, typography }) => ({
    root: {
        position: 'relative',
        marginTop: spacing(1),
        marginBottom: spacing(1),
    },
    childrenContainer: {
        position: 'relative',
    },
    content: {
        ...typography.body1,
        lineHeight: 'initial',
        padding: '18.5px 0 0',
        '&:hover $borders': {
            borderColor: palette.common.black,
        },
    },
    horizontalMargins: {
        paddingLeft: 14,
        paddingRight: 14,
    },
    toolbar: {
        backgroundColor: palette.grey[100],
        marginTop: 18.5,
        padding: spacing(1, 0),
        position: 'sticky',
        left: 0,
        bottom: 0,
    },
    editorContentBlock: {
        '&:not(:last-child)': {
            marginBottom: spacing(2),
        },
    },
    inputLabel: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
    borders: {
        borderRadius: shape.borderRadius,
    },
    focused: {
        borderColor: [palette.primary.main, '!important'],
        borderWidth: 2,
    },
}), { classNamePrefix: 'Wysiwyg' });

const Wysiwyg = ({ id, defaultValue, onChange, label }) => {
    const [labelWidth, setLabelWidth] = useState(0);
    const labelRef = useRef(null);
   
    const contentState = stateFromHTML(defaultValue);
    const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        const labelNode = ReactDOM.findDOMNode(labelRef.current);
        setLabelWidth(labelNode != null ? labelNode.offsetWidth : 0);
    }, [label]);

    const onChangeHandler = useCallback(newEditorState => {
        const newContentState = newEditorState.getCurrentContent();
        const newContent = stateToHTML(newContentState);
      
        onChange(newContent);
        setEditorState(newEditorState);
    }, [onChange, setEditorState]);

    const onFocusHandler = useCallback(() => setIsFocus(true), [setIsFocus]);
    const onBlurHandler = useCallback(() => setIsFocus(false), [setIsFocus]);

    const classes = useStyles();

    const handleKeyCommand = useCallback((command, currentEditorState) => {
        const newState = RichUtils.handleKeyCommand(currentEditorState, command);

        if (newState) {
            onChangeHandler(newState);
            return 'handled';
        }

        return 'not-handled';
    }, [onChangeHandler]);

    const applyBold = useCallback(() => {
        onChangeHandler(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }, [editorState, onChangeHandler]);

    const applyItalic = useCallback(() => {
        onChangeHandler(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    }, [editorState, onChangeHandler]);

    const applyUnderline = useCallback(() => {
        onChangeHandler(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    }, [editorState, onChangeHandler]);

    const applySoftBreakline = useCallback(() => {
        onChangeHandler(RichUtils.insertSoftNewline(editorState));
    }, [editorState, onChangeHandler]);

    const handleReturn = useCallback((e) => {
        if (e.shiftKey) {
            applySoftBreakline();
            return 'handled';
        }

        return 'not-handled';
    }, [onChangeHandler, applySoftBreakline]);

    const isEmpty = !defaultValue || defaultValue === '<p><br></p>';
    const isActive = isFocus || !isEmpty;


    const blockStyleFn = useCallback((contentBlock) => {
        const type = contentBlock.getType();

        if (type === 'unstyled') {
            return classes.editorContentBlock;
        }
    }, [classes]);

    return (
        <div className={classes.root}>
            <InputLabel
                ref={labelRef}
                htmlFor={id}
                variant="outlined"
                className={classes.inputLabel}
                shrink={isActive}
            >
                { label }
            </InputLabel>
            <div className={classes.childrenContainer}>
                <div id={id} className={classes.content}>
                    <div className={classes.horizontalMargins}>
                        <Editor
                            editorState={editorState}
                            handleKeyCommand={handleKeyCommand}
                            handleReturn={handleReturn}
                            blockStyleFn={blockStyleFn }
                            spellCheck
                            onChange={onChangeHandler}
                            onFocus={onFocusHandler}
                            onBlur={onBlurHandler}
                        />
                    </div>
                    
                    <Toolbar className={classes.toolbar} variant="dense" disableGutters>
                        <div className={classes.horizontalMargins}>
                            <Tooltip title="Bold (Ctrl + B)">
                                <IconButton onClick={applyBold}>
                                    <FormatBold />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Italic (Ctrl + I)">
                                <IconButton onClick={applyItalic}>
                                    <FormatItalic />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Underline (Ctrl + U)">
                                <IconButton onClick={applyUnderline}>
                                    <FormatUnderline />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Soft breakline (Shift + Enter)">
                                <IconButton onClick={applySoftBreakline}>
                                    <KeyboardReturn />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Toolbar>
                    
                    <NotchedOutline
                        className={`${classes.borders} ${isFocus ? classes.focused : ''}`}
                        notched={isActive}
                        labelWidth={labelWidth}
                    />
                </div>
            </div>
        </div>
    );
};

Wysiwyg.propTypes = propTypes;
Wysiwyg.defaultProps = defaultProps;

export default Wysiwyg;