import uuid from 'uuid/v1';

const DEFAULT_COORDINATE = 100;

class Screen {
    static createFromJSON(json) {
        const screen = new Screen(json.name, json.content, json.isStart, json.id);
        screen.x = json.x;
        screen.y = json.y;
        screen.width = json.width;
        screen.height = json.height;
        screen.linkIds = [...json.linkIds];

        return screen;
    }

    constructor(name = '', content = '', isStart = false, id = null) {
        this.id = id || uuid();
        this.name = name;
        this.content = content;
        this.x = DEFAULT_COORDINATE + document.body.scrollLeft;
        this.y = DEFAULT_COORDINATE + document.body.scrollTop;
        this.width = 0;
        this.height = 0;
        this.isStart = isStart;
        this.linkIds = [];
    }

    getNl2BrContent() {
        return this.content.replace(/\n/g, '<br/>');
    }

    getSlug() {
        return this.name.toLowerCase().replace(/\s/g, '-');
    }

    clone() {
        const copiedScreen = new Screen(this.name, this.content, this.isStart, this.id);
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.width = this.width;
        copiedScreen.height = this.height;
        copiedScreen.linkIds = [...this.linkIds];

        return copiedScreen;
    }

    toHTML(allLinks) {
        const navigation = this.linkIds.map(linkId => allLinks[linkId].toHTML()).join('');
        return `
         <section data-yath-screen="${this.id}">
            <div>${this.getNl2BrContent()}</div>
            <nav>${navigation}</nav>
        </section>
        `;
    }
}

export default Screen;