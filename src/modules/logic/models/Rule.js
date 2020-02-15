import shortid from 'shortid';

class Rule {
    static createFromJSON(json) {
        const rule = new Rule(json.operator, json.id);

        rule.conditionIds = [...(json.conditionIds || [])];
        rule.resultIds = [...(json.resultIds || [])];

        return rule;
    }

    constructor(operator, id) {
        this.id = id || shortid.generate();
        this.operator = operator || 'and';
        this.conditionIds = [];
        this.resultIds = [];
    }

    clone() {
        const clone = new Rule(this.operator, this.id);
        
        clone.conditionIds = [...this.conditionIds];
        clone.resultIds = [...this.resultIds];

        return clone;
    }

    toLogic(allConditions) {
        const totalConditions = this.conditionIds.length;

        if (totalConditions === 0) {
            return {};
        }

        const conditions = this.conditionIds.map(conditionId => (
            allConditions[conditionId]
        ));

        if (totalConditions === 1) {
            return conditions[0].toLogic();
        }

        return {
            [this.operator]: conditions.map(condition => condition.toLogic()),
        };
    }
}

export default Rule;
