import React, { useCallback, useState } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Table, TableBody, TableHead, TableCell, TableRow,
    Tooltip, IconButton, Typography, TextField, makeStyles,
    Select, MenuItem, FormControl
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAltOutlined';

import {
    actions as linkActions,
    selectors as linkSelectors
} from 'Modules/links';

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
}), { classNamePrefix: 'LinkList' });

export default function LinkList({ screenId }) {
    const [isConfirmDialogOpen, toggleConfirmDialogOpen] = useState(false);
    const closeConfirmDialog = () => toggleConfirmDialogOpen(false);

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
        const targetId = e.target.value;
        dispatch(linkActions.editLinkTarget(linkId, targetId));
    }, [dispatch]);

    const getOnDeleteLinkHandler = useCallback(linkId => () => {
        setDeleteLink(() => () => {
            dispatch(linkActions.deleteLink(linkId));
            toggleConfirmDialogOpen(false);
        });
        toggleConfirmDialogOpen(true);
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
                                            value={link.targetScreenId || ''}
                                            onChange={getOnChangeLinkTargetHandler(link.id)}
                                            displayEmpty
                                        >
                                            {
                                                otherScreens.map(otherScreen => (
                                                <MenuItem
                                                    key={otherScreen.id}
                                                    value={otherScreen.id}
                                                >
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
                open={isConfirmDialogOpen}
                onAccept={deleteLink}
                onCancel={closeConfirmDialog}
                isDeletion
            >
                Do you really want to delete this link?
            </ConfirmDialog>
        </React.Fragment>
    );
}

LinkList.propTypes = propTypes;
