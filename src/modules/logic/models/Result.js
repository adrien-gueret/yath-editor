import shortid from 'shortid';

import { ADD_ITEM, REDIRECT, REMOVE_ITEM } from '../constants/results';
import resultToValueType from '../constants/resultToValueType';

class Result {
    static createFromJSON(json) {
        const result = new Result(json.type, json.id);
        result.params = {...json.params};

        return result;
    }

    constructor(type = ADD_ITEM, id = null) {
        this.id = id || shortid.generate();
        this.type = type;
        this.params = { total: 1 };
    }

    clone() {
        const clone = new Result(this.type, this.id);
        clone.params = { ...this.params };

        return clone;
    }

    hasError() {
        const valueType = resultToValueType[this.type];
        const hasScreenError = valueType === 'screen' && !this.params.screenId;
        const hasItemError = valueType === 'item' && (!this.params.itemId || !this.params.total);

        return hasScreenError || hasItemError;
    }

    toString() {
        switch(this.type) {
            case ADD_ITEM:
                return `game.inventory.addItem('${this.params.itemId}',${this.paramas.total});`;

            case REMOVE_ITEM:
                return `game.inventory.removeItem('${this.params.itemId}',${this.paramas.total});`;

            case REDIRECT:
                return `game.goToScreen('${this.params.screenId}');return false;`;
        }
    }
}

export default Result;
