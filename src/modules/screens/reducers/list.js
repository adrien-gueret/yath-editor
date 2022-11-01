import shortid from 'shortid';

import ScreenModel from '../models/Screen';

import actionTypes from '../actions/types';


import { actionTypes as linkActionTypes } from 'Modules/links';
import { actionTypes as logicActionTypes } from 'Modules/logic';

const startScreen = new ScreenModel({
    name: 'Start screen',
    content: 'Welcome to the <b>first screen</b> of your story!',
    isStart: true,
});

const INITIAL_STATE = {
    [startScreen.id]: startScreen,
};

export default function list(state = INITIAL_STATE, action) {
    const getScreenCloneByPayloadScreenId = (screenToCloneId = action.payload.screenId) => {
        const correspondingScreen = state[screenToCloneId];

        if (!correspondingScreen) {
            throw new ReferenceError();
        }

        return correspondingScreen.clone();
    };

    try {
        switch (action.type) {
            case actionTypes.ADD_SCREEN:
                return {
                    ...state,
                    [action.payload.screen.id]: action.payload.screen,
                };
    
            case actionTypes.DELETE_SCREEN: {
                const screenToDelete = state[action.payload.screenId];
    
                if (!screenToDelete) {
                    return state;
                }
    
                const newScreens = { ...state };
                delete newScreens[screenToDelete.id];

                const customLinkRegExp = new RegExp(`<a data-yath-go-to="${action.payload.screenId}">(.+?)</a>`, 'gi')

                Object.keys(newScreens).forEach((screenId) => {
                    newScreens[screenId].content = newScreens[screenId].content.replace(customLinkRegExp, '$1');
                    newScreens[screenId].alternativeContents = newScreens[screenId]
                        .alternativeContents.map(({ id, value }) => ({ id, value: value.replace(customLinkRegExp, '$1') }));
                });

                return newScreens;
            }
    
            case actionTypes.DELETE_ALL_SCREENS: {
                return {};
            }
    
            case actionTypes.EDIT_SCREEN_NAME: {
                let newName = action.payload.newName;
                let alreadyExisted = false;
    
                do {
                    const newSlug = new ScreenModel({ name: newName, id: 1 }).getSlug();
                    alreadyExisted = Object.keys(state).some(screenId => state[screenId].getSlug() === newSlug);
    
                    if (alreadyExisted) {
                        newName += '_2';
                    }
                } while(alreadyExisted);
    
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.name = newName;
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.EDIT_SCREEN_CONTENT: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.content = action.payload.newContent === '<p></p>' ? '' : action.payload.newContent;
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.ADD_ALTERNATIVE_SCREEN_CONTENT: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.alternativeContents = [...newScreen.alternativeContents, { id: shortid.generate(), value: '' }];
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.EDIT_ALTERNATIVE_SCREEN_CONTENT: {
                const newScreen = getScreenCloneByPayloadScreenId();
    
                const alternativeContent = newScreen.alternativeContents.find(({ id }) => id === action.payload.contentId);
    
                if (!alternativeContent) {
                    return state;
                }
    
                const newValue = action.payload.newContent === '<p></p>' ? '' : action.payload.newContent;
    
                newScreen.alternativeContents = newScreen.alternativeContents.map(({ id, value }) => (
                    id !== action.payload.contentId ? { id, value } : { id, value: newValue }
                ));
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.DELETE_ALTERNATIVE_SCREEN_CONTENT: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.alternativeContents = newScreen.alternativeContents.filter(({ id }) => id !== action.payload.contentId);
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.EDIT_SCREEN_IMAGE: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.image = action.payload.newImage;
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.EDIT_SCREEN_IMAGE_ORDER: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.mustRenderImageAfterContent = action.payload.mustRenderAfterContent;
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.SET_START_SCREEN: {
                return Object.keys(state)
                    .reduce((newState, screenId) => {
                        const clonedScreen = getScreenCloneByPayloadScreenId(screenId);
                        clonedScreen.isStart = clonedScreen.id === action.payload.screenId;
    
                        return {
                            ...newState,
                            [clonedScreen.id]: clonedScreen,
                        };
                    }, {});
            }
    
            case actionTypes.MOVE_SCREEN: {
                const newScreen = getScreenCloneByPayloadScreenId();
    
                newScreen.x = Math.max(0, action.payload.newX);
                newScreen.y = Math.max(0, action.payload.newY);
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.SELECT_SCREEN: {
                const newScreen = getScreenCloneByPayloadScreenId();
    
                newScreen.isSelected = true;
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.UNSELECT_SCREEN: {
                const newScreen = getScreenCloneByPayloadScreenId();
    
                newScreen.isSelected = false;
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.RESIZE_SCREEN: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.width = action.payload.newWidth;
                newScreen.height = action.payload.newHeight;
    
                if (action.payload.newX !== null) {
                    newScreen.x = action.payload.newX;
                }
    
                if (action.payload.newY !== null) {
                    newScreen.y = action.payload.newY;
                }
    
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case actionTypes.LOAD_SCREENS: {
                return Object.keys(action.payload.screensData.list)
                        .map(screenId => ScreenModel.createFromJSON({
                            ...action.payload.screensData.list[screenId],
                            id: screenId,
                        }))
                        .reduce((newState, screen) => ({
                            ...newState,
                            [screen.id]: screen,
                        }), {});
            }
    
            case linkActionTypes.ADD_LINK: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.linkIds.push(action.payload.link.id);
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case linkActionTypes.DELETE_LINK: {
                return Object.keys(state).reduce((allScreens, screenId) => {
                    const clone = getScreenCloneByPayloadScreenId(screenId);
                    clone.linkIds = clone.linkIds.filter(linkId => linkId !== action.payload.linkId);
    
                    return {
                        ...allScreens,
                        [screenId]: clone,
                    };
                }, {});
            }
    
            case logicActionTypes.ADD_RULE: {
                const newScreen = getScreenCloneByPayloadScreenId();
                newScreen.logicRuleIds.push(action.payload.rule.id);
    
                return {
                    ...state,
                    [action.payload.screenId]: newScreen,
                };
            }
    
            case logicActionTypes.DELETE_RULES: {
                return Object.keys(state).reduce((allScreens, screenId) => {
                    const clone = getScreenCloneByPayloadScreenId(screenId);
    
                    clone.logicRuleIds = clone.logicRuleIds.filter(ruleId => (
                        action.payload.ruleIds.indexOf(ruleId) === -1
                    ));
    
                    return {
                        ...allScreens,
                        [screenId]: clone,
                    };
                }, {});
            }
    
            default:
                return state;
        }
    } catch (e) {
        if (!(e instanceof ReferenceError)) {
            console.error(e);
        }

        return state;
    }
}
