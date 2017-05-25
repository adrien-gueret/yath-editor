let screenChoiceLastId = 1;

class ScreenChoice {
    constructor(label = '', targetScreenId = 0, id = null) {
        this.id = id || screenChoiceLastId++;
        this.label = label;
        this.targetScreenId = targetScreenId;
    }

    clone() {
        return new ScreenChoice(this.label, this.targetScreenId, this.id);
    }
}

export default ScreenChoice;