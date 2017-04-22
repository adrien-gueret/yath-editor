class ScreenAction {
    constructor(label = '', targetScreen = '') {
        this.label = label;
        this.targetScreen = targetScreen;
    }

    clone() {
        return new ScreenAction(this.label, this.targetScreen);
    }
}

export default ScreenAction;