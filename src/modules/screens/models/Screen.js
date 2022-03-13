import shortid from 'shortid';
import slugify from 'slugify';

const DEFAULT_COORDINATE = 100;

class Screen {
    static createFromJSON(json) {
        const screen = new Screen(json);

        screen.x = json.x;
        screen.y = json.y;
        screen.width = json.width;
        screen.height = json.height;
        screen.image = json.image;
        screen.mustRenderImageAfterContent = !!json.mustRenderImageAfterContent;
        screen.linkIds = [...(json.linkIds || [])];
        screen.logicRuleIds = [...(json.logicRuleIds || [])];
        screen.alternativeContents = [...(json.alternativeContents || [])];
        screen.isSelected = false;

        return screen;
    }

    constructor({ name = '', content = '', isStart = false, id = null, x = DEFAULT_COORDINATE, y = DEFAULT_COORDINATE } = {}) {
        this.id = id || shortid.generate();
        this.name = name;
        this.content = content;
        this.x = x + document.documentElement.scrollLeft;
        this.y = y + document.documentElement.scrollTop;
        this.width = 0;
        this.height = 0;
        this.image = '';
        this.mustRenderImageAfterContent = false;
        this.isStart = isStart;
        this.linkIds = [];
        this.logicRuleIds = [];
        this.isSelected = false;
        this.alternativeContents = [];
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
        const copiedScreen = new Screen(this);
        copiedScreen.x = this.x;
        copiedScreen.y = this.y;
        copiedScreen.width = this.width;
        copiedScreen.height = this.height;
        copiedScreen.image = this.image;
        copiedScreen.mustRenderImageAfterContent = !!this.mustRenderImageAfterContent;
        copiedScreen.linkIds = [...this.linkIds];
        copiedScreen.logicRuleIds = [...this.logicRuleIds];
        copiedScreen.alternativeContents = [...this.alternativeContents];
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

    getStringifiedRules(logic) {
        const stringifiedRules = this.logicRuleIds
            .map(ruleId => logic.rules[ruleId].toString(logic.results, logic.conditions))
            .filter(stringifiedRule => !!stringifiedRule)
            .join('');

        const switchToDefaultContentRule = this.alternativeContents.length > 0
            ? `screen.querySelector('[data-yath-main-content]').style.display="block";for(let c of screen.querySelectorAll('[data-yath-alt-content]')){c.style.display="none";}`
            : '';

        if (!stringifiedRules && !switchToDefaultContentRule) {
            return '';
        }

        return `case '${this.id}':{${switchToDefaultContentRule}${stringifiedRules}}`;
    }

    toHTML(allLinks) {
        const navigation = this.linkIds.map(linkId => allLinks[linkId].toHTML()).join('');
        const htmlImage = this.image ? `<img class="yathImage" src="${this.image}" alt="" />` : '';

        return `
         <section data-yath-screen="${this.id}">
            ${(!this.mustRenderImageAfterContent && htmlImage) ? htmlImage : ''}
            <div data-yath-main-content>${this.content}</div>
            ${this.alternativeContents.map(({ id, value }) => `<div data-yath-alt-content="${id}">${value}</div>`).join('')}
            ${(this.mustRenderImageAfterContent && htmlImage) ? htmlImage : ''}
            <nav>${navigation}</nav>
        </section>
        `;
    }
}

export default Screen;