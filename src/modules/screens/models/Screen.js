import shortid from 'shortid';
import slugify from 'slugify';

const DEFAULT_COORDINATE = 100;

class Screen {
    static createFromJSON(json) {
        const screen = new Screen(json.name, json.content, json.isStart, json.id);
        screen.x = json.x;
        screen.y = json.y;
        screen.width = json.width;
        screen.height = json.height;
        screen.linkIds = [...json.linkIds];
        screen.isSelected = false;

        return screen;
    }

    constructor(name = '', content = '', isStart = false, id = null) {
        this.id = id || shortid.generate();
        this.name = name;
        this.content = content;
        this.x = DEFAULT_COORDINATE + document.body.scrollLeft;
        this.y = DEFAULT_COORDINATE + document.body.scrollTop;
        this.width = 0;
        this.height = 0;
        this.isStart = isStart;
        this.linkIds = [];
        this.isSelected = false;
    }

    getCoordinates() {
        const { x, y } = this;

        return {
            x: x - x % 20,
            y: y - y % 20,
        };
    }

    getSlug() {
        return slugify(this.name);
    }

    clone() {
        const copiedScreen = new Screen(this.name, this.content, this.isStart, this.id);
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.width = this.width;
        copiedScreen.height = this.height;
        copiedScreen.linkIds = [...this.linkIds];
        copiedScreen.isSelected = this.isSelected;

        return copiedScreen;
    }

    doesCollied(otherScreen) {
        const { x: thisX, y: thisY } = this.getCoordinates();
        const { x: otherX, y: otherY } = otherScreen.getCoordinates();

        const doesNotCollied = 
            (otherX > thisX + this.width) ||
            (otherX + otherScreen.width < thisX) ||
            (otherY > thisY + this.height) ||
            (otherY + otherScreen.height < thisY);

        return !doesNotCollied;
    }

    toHTML(allLinks) {
        const navigation = this.linkIds.map(linkId => allLinks[linkId].toHTML()).join('');
        return `
         <section data-yath-screen="${this.id}">
            <div>${this.content}</div>
            <nav>${navigation}</nav>
        </section>
        `;
    }
}

export default Screen;