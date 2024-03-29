import React, { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import AddScreenDialog from '../components/AddScreenDialog';
import ScreenModel from '../models/Screen';
import listSelectors from '../selectors/list';
import actions from '../actions';

export default function useAddScreenDialog(shouldRedirectToNewScreen = false) {
    const [isAddScreenDialogOpen, setIsAddScreenDialogOpen] = useState(false);
    const [submitCallback, setSubmitCallback] = useState(() => () => {});
    const [newScreenPosition, setNewScreenPosition] = useState(null);
    const dispatch = useDispatch();
    const screenSlugs = useSelector(listSelectors.getAllSlugs, shallowEqual);

    const addScreenHandler = useCallback((newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = screenSlugs.some(slug => slug === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        dispatch(actions.addScreen(newScreen));
        
        if (shouldRedirectToNewScreen) {
            dispatch(actions.setEditScreen(newScreen.id));
        }
    }, [dispatch, screenSlugs, shouldRedirectToNewScreen]);

    const onAddScreenDialogClose = useCallback(() => {
        setIsAddScreenDialogOpen(false);
    }, [setIsAddScreenDialogOpen]);

    const openDialog = useCallback(({ onSubmit = () => {}, screenPosition = null} = {}) => {
        setNewScreenPosition(screenPosition);
        setSubmitCallback(() => onSubmit);
        setIsAddScreenDialogOpen(true);
    }, [setIsAddScreenDialogOpen]);

    const onAddScreenDialogSubmit = useCallback((screenName) => {
        if (screenName) {
            const screenOptions = { name: screenName};

            if (newScreenPosition) {
                screenOptions.x = newScreenPosition.x;
                screenOptions.y = newScreenPosition.y;
            }

            const newScreen = new ScreenModel(screenOptions);

            addScreenHandler(newScreen);
            submitCallback(newScreen);
        }
        onAddScreenDialogClose();
    }, [addScreenHandler, submitCallback, onAddScreenDialogClose]);

    const dialog = useMemo(() => (
        <AddScreenDialog
            isOpen={isAddScreenDialogOpen}
            onClose={onAddScreenDialogClose}
            onSubmit={onAddScreenDialogSubmit}
        />
    ), [isAddScreenDialogOpen, onAddScreenDialogClose]);

    return { openAddScreenDialog: openDialog, addScreenDialog: dialog };
}