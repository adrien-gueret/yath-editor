import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';

import { InputLabel, makeStyles, Toolbar, Tooltip, IconButton } from '@material-ui/core';

import NotchedOutline from '@material-ui/core/OutlinedInput/NotchedOutline';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatUnderline from '@material-ui/icons/FormatUnderlined';
import LinkIcon from '@material-ui/icons/Link';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

import { Editor, EditorState, RichUtils, CompositeDecorator } from 'draft-js';

import { convertFromHTML, convertToHTML } from 'draft-convert';

import selectors from '../../selectors';

import WysiwyContext from './WysiwyContext';
import YathLink from './YathLink';
import YathLinkDialog from './YathLinkDialog';

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    toolbarButtons: PropTypes.node,
};

const defaultProps = {
    defaultValue: undefined,
    onChange() {},
    toolbarButtons: null,
};

const stateToHTML = convertToHTML({
    entityToHTML(entity, originalText)  {
        if (entity.type === 'YATH_LINK') {
            return <a data-yath-go-to={entity.data.screenId}>{ originalText }</a>;
        }

        return originalText;
      }
});

const htmlToState = convertFromHTML({
    htmlToEntity(nodeName, node, createEntity) {
        if (nodeName === 'a' && 'yathGoTo' in node.dataset) {
            return createEntity(
                'YATH_LINK',
                'MUTABLE',
                { screenId: node.dataset.yathGoTo }
            )
        }
    }
});

const customLinkDecorator = new CompositeDecorator([{
    strategy(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'YATH_LINK'
            );
          },
          callback
        );
    },
    component: YathLink,
}]);

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

const Wysiwyg = ({ id, defaultValue, onChange, label, toolbarButtons, screenId }) => {
    const [labelWidth, setLabelWidth] = useState(0);
    const labelRef = useRef(null);
   
    const contentState = htmlToState(defaultValue);
    const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState, customLinkDecorator));
    const [isFocus, setIsFocus] = useState(false);

    const [showCustomLinkDialog, setShowCustomLinkDialog] = useState(false);
    const [customLinkTargetScreenId, setCustomLinkTargetScreenId] = useState(null);

    const currentInlineStyle = editorState.getCurrentInlineStyle();
    const currentSelection = editorState.getSelection();

    const otherScreens = useSelector(state => (
        selectors.list.getAllExceptOne(state, screenId)
    ));
    const canShowLinkButton = otherScreens.length > 0;

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

    const forceReselect = useCallback((editorStateToReslect) => {
        onChangeHandler(EditorState.forceSelection(editorStateToReslect, editorStateToReslect.getSelection()));
        onFocusHandler();
    }, [onChangeHandler, onFocusHandler]);

    const applyBold = useCallback(() => {
        forceReselect(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }, [editorState, forceReselect]);

    const applyItalic = useCallback(() => {
        forceReselect(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    }, [editorState, forceReselect]);

    const applyUnderline = useCallback(() => {
        forceReselect(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    }, [editorState, forceReselect]);

    const applyLink = useCallback(() => {
        const selection = editorState.getSelection();
        if (selection.isCollapsed()) {
            return;
        }

        const contentState = editorState.getCurrentContent();
        const startKey = editorState.getSelection().getStartKey();
        const startOffset = editorState.getSelection().getStartOffset();
        const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
        const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

        if (linkKey) {
            const linkInstance = contentState.getEntity(linkKey);
            setCustomLinkTargetScreenId(linkInstance.getData().screenId);
        }

        setShowCustomLinkDialog(true);
    }, [editorState, forceReselect]);

    const applySoftBreakline = useCallback(() => {
        if (!currentSelection.isCollapsed()) {
            return;
        }

        forceReselect(RichUtils.insertSoftNewline(editorState));
    }, [editorState, forceReselect, currentSelection]);

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

    const onCustomLinkSubmit = useCallback((selectedScreenId) => {
        setShowCustomLinkDialog(false);

        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          'YATH_LINK',
          'MUTABLE',
          {screenId: selectedScreenId}
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

        forceReselect(RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            entityKey
        ));

        setCustomLinkTargetScreenId(null);
    }, [editorState]);

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
                        <WysiwyContext.Provider value={{ editorState, screenId, updateEditorState: onChangeHandler }}>
                            <Editor
                                editorState={editorState}
                                handleKeyCommand={handleKeyCommand}
                                handleReturn={handleReturn}
                                blockStyleFn={blockStyleFn}
                                spellCheck
                                onChange={onChangeHandler}
                                onFocus={onFocusHandler}
                                onBlur={onBlurHandler}
                            />
                        </WysiwyContext.Provider>
                    </div>
                    
                    <Toolbar className={classes.toolbar} variant="dense" disableGutters>
                        <div className={classes.horizontalMargins}>
                            { toolbarButtons }
                            <Tooltip title="Bold (Ctrl + B)">
                                <IconButton
                                    onClick={applyBold}
                                    color={ isFocus && currentInlineStyle.has('BOLD') ? 'primary' : 'default' }
                                >
                                    <FormatBold />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Italic (Ctrl + I)">
                                <IconButton
                                    onClick={applyItalic}
                                    color={ isFocus && currentInlineStyle.has('ITALIC') ? 'primary' : 'default' }
                                >
                                    <FormatItalic />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Underline (Ctrl + U)">
                                <IconButton
                                    onClick={(applyUnderline)}
                                    color={ isFocus && currentInlineStyle.has('UNDERLINE') ? 'primary' : 'default' }
                                >
                                    <FormatUnderline />
                                </IconButton>
                            </Tooltip>

                            { canShowLinkButton && (
                                 <Tooltip title="Link">
                                    <IconButton
                                        onClick={applyLink}
                                        color={ isFocus && currentInlineStyle.has('YATH_LINK') ? 'primary' : 'default' }
                                    >
                                        <LinkIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title="Soft breakline (Shift + Enter)">
                                <IconButton onClick={applySoftBreakline} disabled={!currentSelection.isCollapsed()}>
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

            <YathLinkDialog
                isOpen={showCustomLinkDialog}
                excludedScreenId={screenId}
                defaultSelectedScreenId={customLinkTargetScreenId}
                onSubmit={onCustomLinkSubmit}
                onClose={() => setShowCustomLinkDialog(false)}
            />
        </div>
    );
};

Wysiwyg.propTypes = propTypes;
Wysiwyg.defaultProps = defaultProps;

export default Wysiwyg;