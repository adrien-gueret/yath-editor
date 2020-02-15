import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
    makeStyles, Select, MenuItem, ListItemIcon
} from '@material-ui/core';

import AddItemIcon from '@material-ui/icons/VpnKey';

import selectors from '../../selectors';
import useAddItemDialog from '../../hooks/useAddItemDialog';

const propTypes = {
    allowCreation: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    selectedItemName: PropTypes.string,
};

const defaultProps = {
    allowCreation: false,
    className: '',
    onChange() {},
    selectedItemName: '',
};

const useStyles = makeStyles(({ spacing }) => ({
    outlined: {
        padding: spacing(1),
    },
    editScreenButton: {
        margin: spacing(0, 1, 0, 0),
    },
}), { classNamePrefix: 'ItemList' });

export default function ItemList({
    allowCreation, onChange, className, selectedItemName, ...otherProps
}) {
    const { openAddItemDialog, addItemDialog } = useAddItemDialog();

    const items = useSelector(state => selectors.items.getAsArray(state));

    const onChangeHandler = useCallback(e => {
        const { value } = e.target;

        if (allowCreation && value === 'create-new-item') {
            openAddItemDialog(({ id }) => onChange(id));
            return;
        }

        onChange(value);
    }, [openAddItemDialog, onChange, allowCreation]);

    const classes = useStyles();

    return (
        <>
            <Select
                className={className}
                classes={{ outlined: classes.outlined }}
                value={selectedItemName || ''}
                onChange={onChangeHandler}
                displayEmpty
                {...otherProps}
            >
                { allowCreation && (
                    <MenuItem value="create-new-item">
                        <ListItemIcon><AddItemIcon /></ListItemIcon>
                        Create new item
                    </MenuItem>
                )}

                {
                    items.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))
                }
            </Select>
            { addItemDialog }
        </>
    );
}

ItemList.propTypes = propTypes;
ItemList.defaultProps = defaultProps;
