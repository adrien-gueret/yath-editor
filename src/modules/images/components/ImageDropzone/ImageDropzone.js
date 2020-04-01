import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { Paper, makeStyles, Typography, Link, LinearProgress } from '@material-ui/core';

import cloudinary from '../../services/cloudinary';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    root: {
        padding: spacing(4, 2),
        borderWidth: 5,
        borderStyle: 'dashed',
        outline: 'none',
        textAlign: 'center',
        borderColor({ isDragActive, isDragAccept, isDragReject }) {
            if (isDragAccept) {
                return palette.success.light;
            }

            if (isDragReject) {
                return palette.error.light;
            }

            if (isDragActive) {
                return palette.info.light;
            }

            return palette.divider;
        }
    },
    dragNdropInstructions: {
        fontWeight: typography.fontWeightMedium,
    },
}), { classNamePrefix: 'ImageDropzone' });


export default function ImageDropzone({ cloudName, cloudPreset, onUpload }) {
    const [uploadProgress, setUploadProgress] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, open, acceptedFiles, rejectedFiles } = useDropzone({
        accept: 'image/*',
        multiple: false,
        noClick: true,
        disabled: uploadProgress !== false,
        onDrop: () => setUploadError(false),
    });

    const acceptedFile = acceptedFiles[0];

    const uploadFile = useCallback(async() => {
        if (!acceptedFile) {
            return;
        }

        setUploadProgress(0);
        setUploadError(false);

        try {
            const imageUrl = await cloudinary.uploadFile(acceptedFile, cloudName, cloudPreset, setUploadProgress);
            onUpload(imageUrl);
        } catch (e) {
            setUploadProgress(false);
            setUploadError(true);
        }
        
        
    }, [acceptedFile, cloudName, cloudPreset, onUpload]);

    useEffect(() => {
        uploadFile();
    }, [uploadFile]);

    const classes = useStyles({ isDragActive, isDragAccept, isDragReject });

    return (
        <Paper {...getRootProps()} className={classes.root} variant="outlined" square>
            <input {...getInputProps()} />
            {
                uploadProgress === false ? (
                    <>
                        <Typography variant="body1" className={classes.dragNdropInstructions}>
                            Drag and drop your image
                            { ' ' }
                            <Link onClick={open} component="button" variant="body1" className={classes.dragNdropInstructions}>or click here</Link>
                            .
                        </Typography>
                        <Typography variant="body1">
                            Image will be uploaded on your Cloudinary cloud <strong>{ cloudName }</strong> using your preset <strong>{ cloudPreset }</strong>.
                        </Typography>
                        { rejectedFiles.length > 0 && (
                            <Typography variant="body2" color="error">Only images can be uploaded.</Typography>
                        )}
                        { uploadError && (
                            <Typography variant="body2" color="error">Image can't be uploaded. Please check your Internet connexion or your Cloudinary settings.</Typography>
                        )}
                    </>
                ) : (
                    <>
                        <Typography variant="body1">
                            Upload in progress...
                        </Typography>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </>
                )
            }
        </Paper>
    );
}