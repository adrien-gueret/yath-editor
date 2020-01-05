import React, { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import AddScreenDialog from '../components/AddScreenDialog';
import ScreenModel from '../models/Screen';
import listSelectors from '../selectors/list';
import actions from '../actions';

export default function useAddScreenDialog() {
    const [isAddScreenDialogOpen, setIsAddScreenDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const screens = useSelector(listSelectors.getAsArray, shallowEqual);

    const addScreenHandler = useCallback((newScreen) => {
        const newSlug = newScreen.getSlug();
        const nameAlreadyUsed = screens.some(screen => screen.getSlug() === newSlug);

        if (nameAlreadyUsed) {
            alert(`Slug "${newSlug}" is already used in this project.`);
            return;
        }

        dispatch(actions.addScreen(newScreen));
        dispatch(actions.setEditScreen(newScreen.id));
    }, [dispatch, screens]);

    const onAddScreenDialogClose = useCallback(() => {
        setIsAddScreenDialogOpen(false);
    }, [setIsAddScreenDialogOpen]);

    const openDialog = useCallback(() => {
        setIsAddScreenDialogOpen(true);
    }, [setIsAddScreenDialogOpen]);

    const onAddScreenDialogSubmit = useCallback((screenName) => {
        if (screenName) {
            addScreenHandler(new ScreenModel(screenName));
        }
        onAddScreenDialogClose();
    }, [onAddScreenDialogClose]);

    const dialog = useMemo(() => (
        <AddScreenDialog
            isOpen={isAddScreenDialogOpen}
            onClose={onAddScreenDialogClose}
            onSubmit={onAddScreenDialogSubmit}
        />
    ), [isAddScreenDialogOpen, onAddScreenDialogClose]);

    return { openDialog, dialog };
}