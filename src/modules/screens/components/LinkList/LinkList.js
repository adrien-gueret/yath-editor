import React, { useCallback } from 'react';
import PropTypes from 'proptypes';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
    Tooltip, Table, TableBody, TableHead, TableCell, TableRow, IconButton, Typography,
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
    
    if (!links.length) {
        return <Typography variant="caption">This screen has no links yet.</Typography>;
    }

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Label</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Target screen</TableCell>
                    <TableCell></TableCell>
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
