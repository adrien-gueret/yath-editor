class Screen {
    static DEFAULT_COORDINATE = 100;

    constructor(name = '') {
        this.name = name;
        this.x = Screen.DEFAULT_COORDINATE;
        this.y = Screen.DEFAULT_COORDINATE;
    }

    getSlug() {
        return this.name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

export default Screen;