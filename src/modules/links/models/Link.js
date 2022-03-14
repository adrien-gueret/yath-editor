import shortid from 'shortid';

export default class Link {
    constructor(label = '', targetScreenId = null, id = null) {
        this.id = id || shortid.generate();
        this.label = label;
        this.targetScreenId = targetScreenId;
    }

    clone() {
        return new Link(this.label, this.targetScreenId, this.id);
    }

    toHTML() {
        return `<button data-yath-link="${this.id}" data-yath-go-to="${this.targetScreenId}">${this.label}</button>`;
    }
}