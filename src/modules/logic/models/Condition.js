import shortid from 'shortid';
import { PLAYER_HAS_NOT_VISITED } from '../constants/conditionSubjects';
import conditionSubjectToValueType from '../constants/conditionSubjectToValueType';

class Condition {
    static createFromJSON(json) {
        const condition = new Condition(json.subject, json.id);
        condition.params = {...json.params};

        return condition;
    }

    constructor(subject = PLAYER_HAS_NOT_VISITED, id = null) {
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
        const hasItemError = valueType === 'item' && (!this.params.itemId || !this.params.total);

        return hasScreenError || hasItemError;
    }

    toLogic() {
        const { method, valueToCheck } = conditionSubjectToJSONLogic[this.subject];
        
        return {
            '===': [
                valueToCheck,
                {
                    method: [
                        { var: 'player' },
                        method,
                        [this.expectedValue],
                    ]
                }
            ],
        };
    }
}

export default Condition;
