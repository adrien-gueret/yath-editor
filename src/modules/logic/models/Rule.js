import shortid from 'shortid';

class Rule {
    static createFromJSON(json) {
        const rule = new Rule(json.operator, json.id);

        rule.conditionGroupIds = [...(json.conditionGroupIds || [])];
        rule.resultIds = [...(json.resultIds || [])];

        return rule;
    }

    constructor(operator, id) {
        this.id = id || shortid.generate();
        this.operator = operator || 'and';
        this.conditionGroupIds = [];
        this.resultIds = [];
    }

    clone() {
        const clone = new Rule(this.operator, this.id);
        
        clone.conditionGroupIds = [...this.conditionGroupIds];
        clone.resultIds = [...this.resultIds];

        return clone;
    }

    toLogic(allConditionGroups, allConditions) {
        const totalConditionGroups = this.conditionGroupIds.length;

        if (totalConditionGroups === 0) {
            return {};
        }

        const conditionGroups = this.conditionGroupIds.map(conditionGroupId => (
            allConditionGroups[conditionGroupId]
        ));

        if (totalConditionGroups === 1) {
            return conditionGroups[0].toLogic(allConditions);
        }

        return {
            [this.operator]: conditionGroups.map(conditionGroup => conditionGroup.toLogic(allConditions)),
        };
    }
}

export default Rule;
