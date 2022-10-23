import actionTypes from '../actions/types';

export const INITIAL_STATE = `/*
    This script will be exectued on screen change.
    You can access these constants:

    - screen: DOM element representing the target screen the user will move to;
    - screenName: string containing the name of the screen the user will move to;
    - game: the global game object containing some helpers you can use in your script:
        {
            goToScreen(screenName: string),
                // Redirect player to given screen

            getScreenVisits(screenName: string): number,
                // Returns total of times player has visited given screen

            hasVisitedScreen(screenName: string): boolean,
                // Returns true if player has visited given screen at least once

            resetHistory(),
                // Reset history so that game will now consider player has visited no screens yet

            inventory: {
                // Object containing inventory helpers
                
                countItem(itemName: string): number,
                    // Returns total of given item in player inventory

                hasItem(itemName: string): boolean,
                    // Return true if given item is at least once in player inventory
                
                addItem(itemName: string, total: number): number,
                    // Add "total" of given item in player inventory, and returns new total

                removeItem(itemName: string, total: number): number,
                    // Remove "total" of given item from player inventory, and returns new total

                getAllItems():  Array<{ itemName: string, total: number }>,
                    // Returns an array containing all items inventory and their total

                reset(),
                    // Remove ALL items from inventory
            },
        };


    /!\\ If you script returns exactly the boolean false, it'll prevent the screen change. /!\\ 
*/`;

export default function customJS(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.SET_CUSTOM_JS:
            return action.payload.js;

        default:
            return state;
    }
}