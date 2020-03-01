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

    toString(allResults, allConditions) {
        const totalResults = this.resultIds.length;

        if (totalResults === 0) {
            return '';
        }

        const stringifiedResults = this.resultIds
            .map(resultId => allResults[resultId].toString())
            .filter(stringifiedRule => !!stringifiedRule)
            .join('');

        const totalConditions = this.conditionIds.length;

        if (totalConditions === 0) {
            return stringifiedResults;
        }

        const stringifiedConditions = this.conditionIds
            .map(conditionId => allConditions[conditionId].toString())
            .filter(stringifiedCondition => !!stringifiedCondition)
            .join(` ${this.operator === 'or' ? '||' : '&&'} `);

        return `if(${stringifiedConditions}){${stringifiedResults}}`;
    }
}

export default Rule;
