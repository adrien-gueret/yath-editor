import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
    IconButton, makeStyles,
    Select, MenuItem, ListItemIcon
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Settings';
import AddScreenIcon from '@material-ui/icons/AddToQueueOutlined';

import actions from '../../actions';
import selectors from '../../selectors';
import useAddScreenDialog from '../../hooks/useAddScreenDialog';

const propTypes = {
    className: PropTypes.string,
    excludedScreenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectedScreenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    allowCreation: PropTypes.bool,
    allowEdition: PropTypes.bool,
    children: PropTypes.node,
};

const defaultProps = {
    className: '',
    excludedScreenId: null,
    selectedScreenId: null,
    onChange() {},
    allowCreation: false,
    allowEdition: false,
    children: null,
};

const useStyles = makeStyles(({ spacing }) => ({
    outlined: {
        padding: spacing(1),
    },
    editScreenButton: {
        margin: spacing(0, 1, 0, 0),
    },
}), { classNamePrefix: 'ScreenList' });

export default function ScreenList({
    allowCreation, allowEdition, excludedScreenId, selectedScreenId, onChange, children, className,
    ...otherProps
}) {
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
        if (!allowEdition) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        dispatch(actions.setEditScreen(screenId));
    }, [dispatch, allowEdition]);

    const classes = useStyles();

    return (
        <>
            <Select
                className={className}
                classes={{ outlined: classes.outlined }}
                value={selectedScreenId || ''}
                onChange={onChangeHandler}
                onOpen={onOpenHandler}
                onClose={onCloseHandler}
                displayEmpty
                {...otherProps}
            >
                { allowCreation && (
                    <MenuItem value="create-new-screen">
                        <ListItemIcon><AddScreenIcon /></ListItemIcon>
                        Create new screen
                    </MenuItem>
                )}

                { children }

                {
                    otherScreens.map(otherScreen => (
                        <MenuItem
                            key={otherScreen.id}
                            value={otherScreen.id}
                        >
                            { (!isOpen && allowEdition) && (
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
        </>
    );
}

ScreenList.propTypes = propTypes;
ScreenList.defaultProps = defaultProps;
