import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { useSelector, shallowEqual } from 'react-redux';

import { makeStyles, Tooltip } from '@material-ui/core';

import { EditorState, SelectionState } from 'draft-js';

import screenSelectors from '../../selectors';

import YathLinkDialog from './YathLinkDialog';
import WysiwyContext from './WysiwyContext';

const propTypes = {
    contentState: PropTypes.any.isRequired,
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    blockKey: PropTypes.string.isRequired,
};

const useStyles = makeStyles(({ palette, typography, shadows }) => ({
    root: {
        cursor: 'pointer',
        color: palette.primary.main,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
    },
    tooltip: {
        ...typography.body2,
        color: palette.text.primary,
        backgroundColor: palette.background.paper,
        boxShadow: shadows[1],
    },
}), { classNamePrefix: 'YathLink' });

const YathLink = ({
    contentState,
    entityKey,
    children,
    start,
    end,
    blockKey,
}) => {
    const classes = useStyles();
    const [showDialog, setShowDialog] = useState(false);
    const { updateEditorState, editorState, screenId } = useContext(WysiwyContext);

    const { screenId: targetScreenId } = contentState.getEntity(entityKey).getData();

    const targetScreen = useSelector(state => screenSelectors.list.getById(state, targetScreenId), shallowEqual) || {};

    const onScreenChange = (newScreenId) => {
        contentState.replaceEntityData(entityKey, {
            screenId: newScreenId,
        })

        const selectionState = SelectionState.createEmpty(blockKey);
        const newSelectionState = selectionState.merge({
          anchorOffset: start,
          focusOffset: end,
        });
    
        updateEditorState(EditorState.forceSelection(editorState, newSelectionState));
    };

    return (
        <>
            <Tooltip
                arrow
                placement="top"
                title={`Redirect to "${targetScreen.name}"`}
                classes={{ tooltip: classes.tooltip}}
            >
                <a
                    className={classes.root}
                    data-yath-go-to={targetScreenId}
                    onClick={() => setShowDialog(true)}
                >{ children }</a>
            </Tooltip>

            <YathLinkDialog
                isOpen={showDialog}
                excludedScreenId={screenId}
                defaultSelectedScreenId={targetScreenId}
                onSubmit={onScreenChange}
                onClose={() => setShowDialog(false)}
            />
        </>
    );
};

YathLink.propTypes = propTypes;

export default YathLink;