import shortid from 'shortid';

import { ADD_ITEM } from '../constants/results';

class Result {
    static createFromJSON(json) {
        const result = new Result(json.type, json.id);
        result.params = [...json.params];

        return result;
    }

    constructor(type = ADD_ITEM, id = null) {
        this.id = id || shortid.generate();
        this.type = type;
        this.params = [];
    }

    clone() {
        const clone = new Result(this.type, this.id);
        clone.params = [...this.params];

        return clone;
    }

}

export default Result;
