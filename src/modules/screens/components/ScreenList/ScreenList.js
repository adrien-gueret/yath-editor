import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
    IconButton, makeStyles,
    Select, MenuItem, FormControl, ListItemIcon
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Settings';
import AddScreenIcon from '@material-ui/icons/AddToQueueOutlined';

import actions from '../../actions';
import selectors from '../../selectors';
import useAddScreenDialog from '../../hooks/useAddScreenDialog';

const propTypes = {
    excludedScreenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectedScreenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    allowCreation: PropTypes.bool,
};

const defaultProps = {
    excludedScreenId: null,
    selectedScreenId: null,
    onChange() {},
    allowCreation: false,
};

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        width: '100%',
    },
    select: {
        padding: spacing(1),
    },
    editScreenButton: {
        margin: spacing(0, 1, 0, 0),
    },
}), { classNamePrefix: 'ScreenList' });

export default function ScreenList({ allowCreation, excludedScreenId, selectedScreenId, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const { openAddScreenDialog, addScreenDialog } = useAddScreenDialog();

    const dispatch = useDispatch();
  
    const otherScreens = useSelector(state => (
        selectors.list.getAllExceptOne(state, excludedScreenId)
    ));

    const onChangeHandler = useCallback(e => {
        const { value } = e.target;

        if (allowCreation && value === 'create-new-screen') {
            openAddScreenDialog(({ id }) => onChange(id));
            return;
        }

        onChange(value);
    }, [openAddScreenDialog, onChange, allowCreation]);

    const onOpenHandler = useCallback(() => setIsOpen(true), [setIsOpen]);
    const onCloseHandler = useCallback(() => setIsOpen(false), [setIsOpen]);

    const getEditScreenHandler = useCallback(screenId => e => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(actions.setEditScreen(screenId));
    }, [dispatch]);

    const classes = useStyles();

    return (
        <FormControl
            variant="outlined"
            className={classes.root}
            error={!selectedScreenId}
        >
            <Select
                classes={{ select: classes.select }}
                value={selectedScreenId || ''}
                onChange={onChangeHandler}
                onOpen={onOpenHandler}
                onClose={onCloseHandler}
                displayEmpty
            >
                { allowCreation && (
                    <MenuItem value="create-new-screen">
                        <ListItemIcon><AddScreenIcon /></ListItemIcon>
                        Create new screen
                    </MenuItem>
                )}

                {
                    otherScreens.map(otherScreen => (
                        <MenuItem
                            key={otherScreen.id}
                            value={otherScreen.id}
                        >
                            { !isOpen && (
                                <IconButton
                                    className={classes.editScreenButton}
                                    size="small"
                                    onClick={getEditScreenHandler(otherScreen.id)}
                                >
                                    <EditIcon />
                                </IconButton>
                            ) }
            
                            {otherScreen.name}
                        </MenuItem>
                    ))
                }
            </Select>
            { addScreenDialog }
        </FormControl>
    );
}

ScreenList.propTypes = propTypes;
ScreenList.defaultProps = defaultProps;
