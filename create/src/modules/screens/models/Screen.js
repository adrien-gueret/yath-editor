import uuid from 'uuid/v1';

class Screen {
    static DEFAULT_COORDINATE = 100;

    static createFromJSON(json) {
        const screen = new Screen(json.name, json.content, json.id);
        screen.x = json.x;
        screen.y = json.y;
        screen.width = json.width;
        screen.height = json.height;
        screen.choicesIds = [...json.choicesIds];

        return screen;
    }

    constructor(name = '', content = '', id = null) {
        this.id = id || uuid();
        this.name = name;
        this.content = content;
        this.x = Screen.DEFAULT_COORDINATE + document.body.scrollLeft;
        this.y = Screen.DEFAULT_COORDINATE + document.body.scrollTop;
        this.width = 0;
        this.height = 0;
        this.choicesIds = [];
    }

    getSlug() {
        return this.name.toLowerCase().replace(/\s/g, '-');
    }

    clone() {
        const copiedScreen = new Screen(this.name, this.content, this.id);
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.width = this.width;
        copiedScreen.height = this.height;
        copiedScreen.choicesIds = [...this.choicesIds];

        return copiedScreen;
    }
}

export default Screen;