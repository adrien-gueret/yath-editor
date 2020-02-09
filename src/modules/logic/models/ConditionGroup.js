import shortid from 'shortid';

class ConditionGroup {
    static createFromJSON(json) {
        const group = new ConditionGroup(json.operator, json.id);
        group.conditionIds = [...(json.conditionIds || [])];

        return group;
    }

    constructor(operator, id) {
        this.id = id || shortid.generate();
        this.operator = operator;
        this.conditionIds = [];
    }

    clone() {
        const clone = new ConditionGroup(this.operator, this.id);
        clone.conditionIds = [...this.conditionIds];

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

export default ConditionGroup;
