import uuid from 'uuid/v1';

class ScreenChoice {
    constructor(label = '', targetScreenId = null, id = null) {
        this.id = id || uuid();
        this.label = label;
        this.targetScreenId = targetScreenId;
    }

    clone() {
        return new ScreenChoice(this.label, this.targetScreenId, this.id);
    }

    toHTML() {
        return `<button data-yath-go-to="${this.targetScreenId}">${this.label}</button>`;
    }
}

export default ScreenChoice;