import shortid from 'shortid';

class Result {
    static createFromJSON(json) {
        const result = new Result(json.type, json.id);
        result.params = [...json.params];
    }

    constructor(type, id) {
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
