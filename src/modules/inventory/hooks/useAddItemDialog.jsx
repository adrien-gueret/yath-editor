import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import AddItemDialog from '../components/AddItemDialog';
import ItemModel from '../models/Item';
import actions from '../actions';

export default function useAddItemDialog() {
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [submitCallback, setSubmitCallback] = useState(() => () => {});
    const dispatch = useDispatch();

    const addItemHandler = useCallback((newItem) => {
        dispatch(actions.addItem(newItem));
    }, [dispatch]);

    const onAddItemDialogClose = useCallback(() => {
        setIsAddItemDialogOpen(false);
    }, [setIsAddItemDialogOpen]);

    const openDialog = useCallback((onSubmitCallback = () => {}) => {
        setSubmitCallback(() => onSubmitCallback);
        setIsAddItemDialogOpen(true);
    }, [setIsAddItemDialogOpen]);

    const onAddItemDialogSubmit = useCallback((itemName) => {
        if (itemName) {
            const newItem = new ItemModel(itemName);
            addItemHandler(newItem);
            submitCallback(newItem);
        }
        onAddItemDialogClose();
    }, [addItemHandler, submitCallback, onAddItemDialogClose]);

    const dialog = useMemo(() => (
        <AddItemDialog
            isOpen={isAddItemDialogOpen}
            onClose={onAddItemDialogClose}
            onSubmit={onAddItemDialogSubmit}
        />
    ), [isAddItemDialogOpen, onAddItemDialogClose]);

    return { openAddItemDialog: openDialog, addItemDialog: dialog };
}