let screenActionLastId = 1;

class ScreenAction {
    constructor(label = '', targetScreen = '') {
        this.id = screenActionLastId++;
        this.label = label;
        this.targetScreen = targetScreen;
    }

    clone() {
        const clone = new ScreenAction(this.label, this.targetScreen);
        clone.id = this.id;
        return clone;
    }

    equals(otherAction) {
        return otherAction instanceof ScreenAction && otherAction.id === this.id;
    }
}

export default ScreenAction;