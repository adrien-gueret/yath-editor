import uuid from 'uuid/v1';

export default class Link {
    constructor(label = '', targetScreenId = null, id = null) {
        this.id = id || uuid();
        this.label = label;
        this.targetScreenId = targetScreenId;
    }

    clone() {
        return new Link(this.label, this.targetScreenId, this.id);
    }

    toHTML() {
        return `<button data-yath-go-to="${this.targetScreenId}">${this.label}</button>`;
    }
}