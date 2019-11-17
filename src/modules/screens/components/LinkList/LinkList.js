import React, { useCallback } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Table, TableBody, TableHead, TableCell, TableRow,
    Tooltip, IconButton, Typography, makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAltOutlined';

import {
    actions as linkActions,
    selectors as linkSelectors
} from 'Modules/links';

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
}), { classNamePrefix: 'LinkList' });

export default function LinkList({ screenId }) {
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
        if (!confirm('Do you really want to delete this link?')) {
            return;
        }

        dispatch(linkActions.deleteLink(linkId));
    }, [dispatch]);
    
    const classes = useStyles();

    if (!links.length) {
        return <Typography variant="caption">This screen has no links yet.</Typography>;
    }

    return (
        <Table size="small" className={classes.root}>
            <TableHead className={classes.header}>
                <TableRow>
                    <TableCell className={classes.headerCell}>Label</TableCell>
                    <TableCell></TableCell>
                    <TableCell className={classes.headerCell}>Target screen</TableCell>
                    <TableCell ></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                     links.map(link => (
                        <TableRow key={link.id}>
                            <TableCell>
                                <input
                                    autoFocus={!link.label.length}
                                    value={link.label}
                                    onChange={getOnChangeLinkLabelHandler(link.id)}
                                    type="text"
                                />
                            </TableCell>
                            <TableCell><ArrowRightIcon /></TableCell>
                            <TableCell>
                                <select
                                    onChange={getOnChangeLinkTargetHandler(link.id)}
                                    defaultValue={link.targetScreenId || null}
                                >
                                    <option>-- Select a screen --</option>
                                    {
                                        otherScreens.map(otherScreen => (
                                           <option
                                               key={otherScreen.id}
                                               value={otherScreen.id}
                                           >
                                               {otherScreen.name}
                                           </option>
                                        ))
                                    }
                                </select>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Delete this action">
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
    );
}

LinkList.propTypes = propTypes;
