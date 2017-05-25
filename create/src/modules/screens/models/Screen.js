let screenLastId = 1;

class Screen {
    static DEFAULT_COORDINATE = 100;

    constructor(name = '', content = '') {
        this.id = screenLastId++;
        this.name = name;
        this.content = content;
        this.x = Screen.DEFAULT_COORDINATE;
        this.y = Screen.DEFAULT_COORDINATE;
        this.actions = [];
    }

    getSlug() {
        return this.name.toLowerCase().replace(/\s/g, '-');
    }

    clone() {
        const copiedScreen = new Screen(this.name, this.content);
        copiedScreen.id = this.id;
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.actions = [...this.actions];

        return copiedScreen;
    }

    equals(otherScreen) {
        return otherScreen instanceof Screen && otherScreen.id === this.id;
    }
}

export default Screen;