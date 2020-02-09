import shortid from 'shortid';
import conditionSubjectToJSONLogic from '../constants/conditionSubjectToJSONLogic';

class Condition {
    static createFromJSON(json) {
        return new Condition(json.subject, json.expectedValue, json.id);
    }

    constructor(subject, expectedValue, id) {
        this.id = id || shortid.generate();
        this.subject = subject;
        this.expectedValue = expectedValue;
    }

    clone() {
        return new Condition(this.subject, this.expectedValue, this.id);
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
