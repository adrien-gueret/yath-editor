import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Tooltip, IconButton, Typography, makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';


import { selectors, actions } from 'Modules/screens';

import { ConfirmDialog } from 'Modules/utils';

import Wysiwyg from '../Wysiwyg';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        marginTop: spacing(2),
    },
}), { classNamePrefix: 'AlternativeContentList' });

export default function AlternativeContentList({ screenId }) {
    const [isDeleteAlternativeContentConfirmDialogOpen, toggleDeleteAlternativeContentConfirmDialogOpen] = useState(false);
    const closeConfirmDialog = () => toggleDeleteAlternativeContentConfirmDialogOpen(false);

    const [deleteAlternativeContent, setDeleteAlternativeContent] = useState(() => closeConfirmDialog);

    const dispatch = useDispatch();

    const alternativeContents = useSelector(state => (
        selectors.list.getById(state, screenId).alternativeContents
    ), shallowEqual);

    const getOnDeleteAlternativeContentHandler = useCallback(contentId => () => {
        setDeleteAlternativeContent(() => () => {
            dispatch(actions.deleteAlternativeScreenContent(screenId, contentId));
            toggleDeleteAlternativeContentConfirmDialogOpen(false);
        });
        toggleDeleteAlternativeContentConfirmDialogOpen(true);
    }, [dispatch, screenId]);

    const onChangeAlternativeContentHandler = useCallback((contentId, newContent) => {
        dispatch(actions.editAlternativeScreenContent(screenId, contentId, newContent));
    }, [dispatch, screenId]);

    const onSwitchAlternativeContentToHTMLHandler = useCallback((contentId) => {
        dispatch(actions.setAlternativeScreenContentAsHTML(screenId, contentId));
    }, [dispatch, screenId]);

    const classes = useStyles();

    if (!alternativeContents.length) {
        return <Typography variant="caption">This screen has no alternative content yet.</Typography>;
    }
    console.log(alternativeContents);

    return (
        <React.Fragment>
            {alternativeContents.map(({ id, value, isHTML }, index) => (
                <div key={id} className={classes.root}>
                    <Wysiwyg
                        screenId={screenId}
                        shouldShowHTML={isHTML}
                        id={`alt-screen-content-${id}`}
                        defaultValue={value}
                        label={`Alternative content n° ${index + 1}`}
                        onChange={(newContent) => onChangeAlternativeContentHandler(id, newContent)}
                        onSwitchToHTML={() => onSwitchAlternativeContentToHTMLHandler(id)}
                        toolbarButtons={(
                            <Tooltip title="Delete this alternative content">
                                <IconButton onClick={getOnDeleteAlternativeContentHandler(id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Tooltip>
                        )}
                    />
                </div>
            ))}
            <ConfirmDialog
                open={isDeleteAlternativeContentConfirmDialogOpen}
                onAccept={deleteAlternativeContent}
                onCancel={closeConfirmDialog}
                isDeletion
            >
                Do you really want to delete this alternative content?
            </ConfirmDialog>
        </React.Fragment>
    );
}

AlternativeContentList.propTypes = propTypes;
