class Screen {
    static DEFAULT_COORDINATE = 100;

    constructor(name = '', content = '') {
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
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.actions = [...this.actions];

        return copiedScreen;
    }
}

export default Screen;