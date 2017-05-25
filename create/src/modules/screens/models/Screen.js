let screenLastId = 1;

class Screen {
    static DEFAULT_COORDINATE = 100;

    constructor(name = '', content = '', id = null) {
        this.id = id || screenLastId++;
        this.name = name;
        this.content = content;
        this.x = Screen.DEFAULT_COORDINATE;
        this.y = Screen.DEFAULT_COORDINATE;
        this.choicesIds = [];
    }

    getSlug() {
        return this.name.toLowerCase().replace(/\s/g, '-');
    }

    clone() {
        const copiedScreen = new Screen(this.name, this.content, this.id);
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.choicesIds = [...this.choicesIds];

        return copiedScreen;
    }
}

export default Screen;