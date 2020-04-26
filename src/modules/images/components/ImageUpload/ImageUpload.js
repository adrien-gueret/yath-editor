import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useDebounce } from 'use-debounce';
import {
    Typography, TextField, Paper, Switch, DialogContentText, Link,
    FormControlLabel, IconButton, makeStyles,
} from '@material-ui/core';

import ErrorIcon from '@material-ui/icons/Error';
import ResetIcon from '@material-ui/icons/Cancel';

import { actions as gameActions, selectors as gameSelectors } from 'Modules/game';

import ImageDropzone from '../ImageDropzone';

const useStyles = makeStyles(({ palette, spacing }) => ({
    fieldContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    field: {
        width: 300,
        marginRight: spacing(1),
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
    switchContainer: {
        margin: spacing(2),
    },
}), { classNamePrefix: 'ImageUpload' });

export default function ImageUpload({
    children,
    imageUrl,
    defaultImageUrl,
    onChange,
    showCloudinaryHint = false,
    inputLabel = 'Image URL',
    inputPlaceholder = 'https://via.placeholder.com/300.png',
}) {
    const dispatch = useDispatch();
    const [hasImageError, setHasImageError] = useState(false);


    const cloudinary = useSelector(state => gameSelectors.otherParameters.getCloudinary(state), shallowEqual);
    const configureGame = useCallback(() => dispatch(gameActions.configureGame('externalTools')), [dispatch]);

    const setImageError = useCallback(() => setHasImageError(true), [setHasImageError]);
    const resetImageError = useCallback(() => setHasImageError(false), [setHasImageError]);

    const [debouncedImageUrl] = useDebounce(imageUrl, 300);
    const [debouncedDefaultImageUrl] = useDebounce(defaultImageUrl, 300);

    const isCloudinaryAvailable = Boolean(cloudinary.name) && Boolean(cloudinary.preset);
    const canRenderImagePreview = (Boolean(debouncedImageUrl) || Boolean(debouncedDefaultImageUrl)) && !hasImageError;

    const [isUploadActive, setIsUploadActive] = useState(isCloudinaryAvailable);

    const onTextFieldChange = (e) => onChange(e.target.value);

    useEffect(() => {
        if (!debouncedImageUrl) {
            resetImageError();
            return;
        }

        const img = new Image();
        img.onerror = setImageError;
        img.onload = resetImageError;

        img.src = debouncedImageUrl;
    }, [debouncedImageUrl, resetImageError, setImageError]);

    useEffect(() => {
        setIsUploadActive(isCloudinaryAvailable);
    }, [isCloudinaryAvailable]);

    const classes = useStyles({ imageUrl: debouncedImageUrl || debouncedDefaultImageUrl, canRenderImagePreview });

    return (
        <>
            <DialogContentText>
                { children }
                {
                    (!isCloudinaryAvailable && showCloudinaryHint) && (
                        <>
                            { ' ' }
                            You can directly upload an image from here if
                            { ' ' }
                            <Link
                                component="button"
                                onClick={configureGame}
                                variant="body1"
                            >
                                you configure your cloud
                            </Link>
                            .
                        </>
                    )
                }
            </DialogContentText>

            {
                isCloudinaryAvailable && (
                    <div className={classes.switchContainer}>
                        <FormControlLabel
                            control={(
                                <Switch checked={isUploadActive} onChange={(e) => setIsUploadActive(e.target.checked)} color="primary"  />
                            )}
                            label="Upload a file"
                        />
                    </div>
                )
            }
            
            { (!isUploadActive || imageUrl) && (
                <span className={classes.fieldContainer}>
                    <TextField
                        className={classes.field}
                        value={imageUrl || ''}
                        onChange={onTextFieldChange}
                        label={inputLabel}
                        variant="outlined"
                        placeholder={inputPlaceholder}
                        disabled={isUploadActive}
                    />
                    { (imageUrl && isUploadActive) && (
                        <IconButton onClick={() => onChange('')}>
                            <ResetIcon />
                        </IconButton>
                    ) }
                </span>
            )}

            { (isUploadActive && !imageUrl) && (
                <ImageDropzone cloudName={cloudinary.name} cloudPreset={cloudinary.preset} onUpload={onChange} />
            )}

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