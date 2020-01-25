import React, { useCallback, useState } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Table, TableBody, TableHead, TableCell, TableRow,
    Tooltip, IconButton, Typography, TextField, makeStyles,
    Select, MenuItem, FormControl, ListItemIcon
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Settings';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAltOutlined';
import AddScreenIcon from '@material-ui/icons/AddToQueueOutlined';

import {
    actions as linkActions,
    selectors as linkSelectors
} from 'Modules/links';

import { useAddScreenDialog, actions as screensActions } from 'Modules/screens';

import { ConfirmDialog } from 'Modules/utils';

import selectors from '../../selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const useStyles = makeStyles(({ palette, spacing }) => ({
    root: {
        marginTop: spacing(2),
        border: `1px solid ${palette.divider}`
    },
    header: {
        backgroundColor: palette.common.black,
    },
    headerCell: {
        color: palette.common.white,
        textAlign: 'center',
    },
    select: {
        width: '100%',
    },
    labelColumn: {
        width: '45%',
    },
    arrowColumn: {
        width: '5%',
        textAlign: 'center',
    },
    targetScreenColumn: {
        width: '45%',
    },
    deleteColumn: {
        width: '5%',
    },
    selectLinkTarget: {
        padding: spacing(1),
    },
    editScreenButton: {
        margin: spacing(0, 1, 0, 0),
    },
}), { classNamePrefix: 'LinkList' });

export default function LinkList({ screenId }) {
    const [isDeleteLinkConfirmDialogOpen, toggleDeleteLinkConfirmDialogOpen] = useState(false);
    const [selectScreenMenuOpenState, setSelectScreenMenuOpenState] = useState({});
    const closeConfirmDialog = () => toggleDeleteLinkConfirmDialogOpen(false);

    const { openAddScreenDialog, addScreenDialog } = useAddScreenDialog((s) => console.log(s));

    const [deleteLink, setDeleteLink] = useState(() => closeConfirmDialog);

    const dispatch = useDispatch();
    const links = useSelector(state => (
        linkSelectors.list.getByScreenId(state, screenId)
    ), shallowEqual);
    const otherScreens = useSelector(state => (
        selectors.list.getAllExceptOne(state, screenId)
    ));

    const getOnChangeLinkLabelHandler = useCallback(linkId => e => {
        const label = e.target.value;
        dispatch(linkActions.editLinkLabel(linkId, label));
    }, [dispatch]);

    const getOnChangeLinkTargetHandler = useCallback(linkId => e => {
        const setNewLink = targetId => dispatch(linkActions.editLinkTarget(linkId, targetId));
        const { value } = e.target;

        if (value === 'create-new-screen') {
            openAddScreenDialog(({ id }) => setNewLink(id));
            return;
        }

        setNewLink(value);
    }, [openAddScreenDialog, dispatch]);

    const getOnDeleteLinkHandler = useCallback(linkId => () => {
        setDeleteLink(() => () => {
            dispatch(linkActions.deleteLink(linkId));
            toggleDeleteLinkConfirmDialogOpen(false);
        });
        toggleDeleteLinkConfirmDialogOpen(true);
    }, [dispatch]);

    const getOpenSelectScreenHandler = useCallback(linkId => () => {
        setSelectScreenMenuOpenState(prevState => ({
            ...prevState,
            [linkId]: true,
        }));
    }, []);

    const getCloseSelectScreenHandler = useCallback(linkId => () => {
        setSelectScreenMenuOpenState(prevState => ({
            ...prevState,
            [linkId]: false,
        }));
    }, []);

    const getEditScreenHandler = useCallback(screenId => e => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(screensActions.setEditScreen(screenId));
    }, [dispatch]);

    const classes = useStyles();

    if (!links.length) {
        return <Typography variant="caption">This screen has no links yet.</Typography>;
    }

    return (
        <React.Fragment>
            <Table className={classes.root}>
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell className={`${classes.headerCell} ${classes.labelColumn}`}>Label</TableCell>
                        <TableCell className={classes.arrowColumn}></TableCell>
                        <TableCell className={`${classes.headerCell} ${classes.targetScreenColumn}`}>Target screen</TableCell>
                        <TableCell className={classes.deleteColumn}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        links.map(link => (
                            <TableRow key={link.id}>
                                <TableCell>
                                    <TextField
                                        margin="dense"
                                        type="text"
                                        autoFocus={!link.label.length}
                                        fullWidth
                                        onChange={getOnChangeLinkLabelHandler(link.id)}
                                        value={link.label}
                                        variant="outlined"
                                        error={!link.label.length}
                                    />
                                </TableCell>
                                <TableCell><ArrowRightIcon /></TableCell>
                                <TableCell>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.select}
                                        error={!link.targetScreenId}
                                    >
                                        <Select
                                            labelId={`label-target-screen-link-${link.id}`}
                                            classes={{ select: classes.selectLinkTarget }}
                                            value={link.targetScreenId || ''}
                                            onChange={getOnChangeLinkTargetHandler(link.id)}
                                            onOpen={getOpenSelectScreenHandler(link.id)}
                                            onClose={getCloseSelectScreenHandler(link.id)}
                                            displayEmpty
                                        >
                                            <MenuItem value="create-new-screen">
                                                <ListItemIcon><AddScreenIcon /></ListItemIcon>
                                                Create new screen
                                            </MenuItem>
                                            {
                                                otherScreens.map(otherScreen => (
                                                <MenuItem
                                                    key={otherScreen.id}
                                                    value={otherScreen.id}
                                                >
                                                    { !selectScreenMenuOpenState[link.id] && (
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
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Delete this link">
                                        <IconButton onClick={getOnDeleteLinkHandler(link.id)}>
                                            <DeleteIcon color="secondary" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <ConfirmDialog
                open={isDeleteLinkConfirmDialogOpen}
                onAccept={deleteLink}
                onCancel={closeConfirmDialog}
                isDeletion
            >
                Do you really want to delete this link?
            </ConfirmDialog>
            { addScreenDialog }
        </React.Fragment>
    );
}

LinkList.propTypes = propTypes;
