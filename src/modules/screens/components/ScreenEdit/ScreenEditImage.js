import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useDebounce } from 'use-debounce';

import {
    DialogContentText, Typography, TextField, Paper, Link, Switch,
    FormControlLabel, IconButton, makeStyles, Select, MenuItem,
} from '@material-ui/core';

import ErrorIcon from '@material-ui/icons/Error';
import ResetIcon from '@material-ui/icons/Cancel';

import { actions as gameActions, selectors as gameSelectors } from 'Modules/game';
import { ImageDropzone } from 'Modules/images';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
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
    imageOrderContainer: {
        textAlign: 'center',
    },
    imageOrderSelector: {
        margin: spacing(0, 1),
    },
}), { classNamePrefix: 'ScreenEditImage' });

export default function ScreenEditImage({ screenId }) {
    const dispatch = useDispatch();
    const [hasImageError, setHasImageError] = useState(false);
   
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    const cloudinary = useSelector(state => gameSelectors.otherParameters.getCloudinary(state), shallowEqual);
    const configureGame = useCallback(() => dispatch(gameActions.configureGame('other')), [dispatch]);
    const [imageUrl] = useDebounce(screen.image, 300);

    const isCloudinaryAvailable = Boolean(cloudinary.name) && Boolean(cloudinary.preset);
    const canRenderImagePreview = Boolean(imageUrl) && !hasImageError;

    const [isUploadActive, setIsUploadActive] = useState(isCloudinaryAvailable);

    const setImageUrl = useCallback((value) => dispatch(actions.editScreenImage(screenId, value)), [dispatch, screenId]);
    const setImageOrder = useCallback((value) => dispatch(actions.editScreenImageOrder(screenId, value)), [dispatch, screenId]);
    const onTextFieldChange = (e) => setImageUrl(e.target.value);
    const setImageError = useCallback(() => setHasImageError(true), [setHasImageError]);
    const resetImageError = useCallback(() => setHasImageError(false), [setHasImageError]);
    console.log(screen.mustRenderImageAfterContent);
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

    useEffect(() => {
        setIsUploadActive(isCloudinaryAvailable);
    }, [isCloudinaryAvailable]);

    const classes = useStyles({ imageUrl, canRenderImagePreview });

    return (
        <>
            <DialogContentText>
                You can add an image to this screen.
                {
                !isCloudinaryAvailable && (
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
            
            { (!isUploadActive || screen.image) && (
                <span className={classes.fieldContainer}>
                    <TextField
                        className={classes.field}
                        value={screen.image || ''}
                        onChange={onTextFieldChange}
                        label="Image URL"
                        variant="outlined"
                        placeholder="https://via.placeholder.com/300.png"
                        disabled={isUploadActive}
                    />
                    { (screen.image && isUploadActive) && (
                        <IconButton onClick={() => setImageUrl('')}>
                            <ResetIcon />
                        </IconButton>
                    ) }
                </span>
            )}

            { (isUploadActive && !screen.image) && (
                <ImageDropzone cloudName={cloudinary.name} cloudPreset={cloudinary.preset} onUpload={setImageUrl} />
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

            { canRenderImagePreview && (
            <>
                <Typography
                    display="block"
                    className={classes.imageOrderContainer}
                    component="div"
                >
                    Render this image
                    <Select
                        className={classes.imageOrderSelector}
                        onChange={(e) => setImageOrder(e.target.value)}
                        value={screen.mustRenderImageAfterContent}
                    >
                        <MenuItem value={false}>before</MenuItem>
                        <MenuItem value={true}>after</MenuItem>
                    </Select>
                    screen content.
                </Typography>
            </>
            )}
        </>
    );
}

ScreenEditImage.propTypes = propTypes;