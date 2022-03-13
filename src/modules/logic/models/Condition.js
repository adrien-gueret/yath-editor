import shortid from 'shortid';
import {
    PLAYER_HAS_VISITED, PLAYER_HAS_NOT_VISITED,
    INVENTORY_CONTAINS, INVENTORY_DOES_NOT_CONTAIN,
} from '../constants/conditionSubjects';
import conditionSubjectToValueType from '../constants/conditionSubjectToValueType';

class Condition {
    static createFromJSON(json) {
        const condition = new Condition(json.subject, json.id);
        condition.params = {...json.params};

        return condition;
    }

    constructor(subject = PLAYER_HAS_VISITED, id = null) {
        this.id = id || shortid.generate();
        this.subject = subject;
        this.params = {};
    }

    clone() {
        const clone = new Condition(this.subject, this.id);
        clone.params = { ...this.params };

        return clone;
    }

    hasError() {
        const valueType = conditionSubjectToValueType[this.subject];
        const hasScreenError = valueType === 'screen' && !this.params.screenId;
        const hasItemError = valueType === 'item' && !this.params.itemId;

        return hasScreenError || hasItemError;
    }

    toString() {
        switch(this.subject) {
            case PLAYER_HAS_VISITED:
                return `game.hasVisitedScreen('${this.params.screenId}')`;

            case PLAYER_HAS_NOT_VISITED:
                return `!game.hasVisitedScreen('${this.params.screenId}')`;

            case INVENTORY_CONTAINS:
                return `game.inventory.countItem('${this.params.itemId}')${this.params.operator}${this.params.total}`;

            case INVENTORY_DOES_NOT_CONTAIN:
                return `!(game.inventory.countItem('${this.params.itemId}')${this.params.operator}${this.params.total})`;
        }
    }
}

export default Condition;
