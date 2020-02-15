import shortid from 'shortid';

class Item {
    static createFromJSON(json) {
        return new Item(json.name, json.id);
    }

    constructor(name, id) {
        this.id = id || shortid.generate();
        this.name = name;
    }

    clone() {
        return new Condition(this.name, this.id);
    }
}

export default Item;
