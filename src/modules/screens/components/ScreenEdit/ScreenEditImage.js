import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Typography, makeStyles, Select, MenuItem,
} from '@material-ui/core';

import { ImageUpload } from 'Modules/images';

import actions from '../../actions';
import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ spacing }) => ({
    imageOrderContainer: {
        textAlign: 'center',
    },
    imageOrderSelector: {
        margin: spacing(0, 1),
    },
}), { classNamePrefix: 'ScreenEditImage' });

export default function ScreenEditImage({ screenId }) {
    const dispatch = useDispatch();
    
    const screen = useSelector(state => selectors.list.getById(state, screenId), shallowEqual);
    
    const setImageUrl = useCallback((value) => dispatch(actions.editScreenImage(screenId, value)), [dispatch, screenId]);
    const setImageOrder = useCallback((value) => dispatch(actions.editScreenImageOrder(screenId, value)), [dispatch, screenId]);

    const classes = useStyles();

    return (
        <>
            <ImageUpload imageUrl={screen.image} onChange={setImageUrl} showCloudinaryHint>
                You can add an image to this screen.
            </ImageUpload>

            { screen.image && (
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