import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useDebounce } from 'use-debounce';

import { DialogContentText, Typography, TextField, Paper, makeStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing }) => ({
    field: {
        width: 300,
    },
    preview: {
        width: 200,
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: [[spacing(2), 'auto']],
        textAlign: 'center',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundColor: ({ canRenderImagePreview }) => canRenderImagePreview ? palette.background.paper : palette.grey[50],
        backgroundImage: ({ imageUrl, canRenderImagePreview}) => canRenderImagePreview ? `url(${imageUrl})` : 'none',
    },
}), { classNamePrefix: 'ScreenEditImage' });

export default function ScreenEditImage({ screenId }) {
    const dispatch = useDispatch();
    const [hasImageError, setHasImageError] = useState(false);
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    const setImageUrl = useCallback((value) => dispatch(actions.editScreenImage(screenId, value)), [dispatch, screenId]);
    const [imageUrl] = useDebounce(screen.image, 300);

    const onTextFieldChange = (e) => setImageUrl(e.target.value);
    const setImageError = useCallback(() => setHasImageError(true), [setHasImageError]);
    const resetImageError = useCallback(() => setHasImageError(false), [setHasImageError]);
    
    useEffect(() => {
        if (!imageUrl) {
            resetImageError();
            return;
        }

        const img = new Image();
        img.onerror = setImageError;
        img.onload = resetImageError;

        img.src = imageUrl;
    }, [imageUrl, resetImageError, setImageError]);

    const canRenderImagePreview = imageUrl && !hasImageError;
    const classes = useStyles({ imageUrl, canRenderImagePreview });

    return (
        <>
            <DialogContentText>You can add here an image to this screen.</DialogContentText>
            <TextField
                className={classes.field}
                value={screen.image || ''}
                onChange={onTextFieldChange}
                label="Image URL"
                variant="outlined"
                placeholder="https://via.placeholder.com/300.png"
            />
            <Paper className={classes.preview} variant="outlined">
                { !canRenderImagePreview && (
                    <Typography variant="subtitle2" component="span" color={hasImageError ? 'error' : 'inherit'}>
                        { hasImageError
                            ? <><ErrorIcon /><br />Can't load the image</>
                            : 'Preview' }    
                    </Typography>
                )}
            </Paper>
        </>
    );
}

ScreenEditImage.propTypes = propTypes;