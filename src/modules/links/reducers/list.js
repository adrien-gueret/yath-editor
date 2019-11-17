import { actionTypes as screenActionTypes } from 'Modules/screens';

import actionTypes from '../actions/types';
import Link from '../models/Link';

export default function list(state = {}, action) {
    switch (action.type) {
        case actionTypes.ADD_LINK: {
            return {
                ...state,
                [action.payload.link.id]: action.payload.link,
            };
        }

        case actionTypes.DELETE_LINK: {
            const linkToDelete = state[action.payload.linkId];

            if (!linkToDelete) {
                return state;
            }

            const newLinks = { ...state };
            delete newLinks[linkToDelete.id];

            return newLinks;
        }

        case actionTypes.DELETE_ALL_LINKS: {
            return {};
        }

        case actionTypes.EDIT_LINK_LABEL: {
            const newLink = state[action.payload.linkId].clone();
            newLink.label = action.payload.newLabel;

            return {
                ...state,
                [action.payload.linkId]: newLink,
            };
        }

        case actionTypes.EDIT_LINK_TARGET: {
            const newLink = state[action.payload.linkId].clone();
            newLink.targetScreenId = action.payload.newTargetId;

            return {
                ...state,
                [action.payload.linkId]: newLink,
            };
        }

        case actionTypes.LOAD_LINKS: {
            return Object.keys(action.payload.linksData.list)
                .map(linkId => {
                    const {label, targetScreenId} = action.payload.linksData.list[linkId];
                    return new Link(label, targetScreenId, linkId);
                })
                .reduce((newState, link) => ({
                    ...newState,
                    [link.id]: link,
                }), {});
        }

        case screenActionTypes.DELETE_SCREEN: {
            const screenId = action.payload.screenId;

            return Object.keys(state).reduce((allLinks, linkId) => {
                const link = state[linkId].clone();
                link.targetScreenId = link.targetScreenId === screenId ? null : link.targetScreenId;

                return {
                    ...allLinks,
                    [linkId]: link,
                };
            }, {});
        }

        default:
            return state;
    }
}
