
import { SelectStatement, ISelector, Selector, ISelectBuilder, Operators } from './Selector'
import * as util from './utils'

export class SelectQL implements ISelectBuilder {
    // The Concrete Builder
    selector: Selector;
    selectInput: any;
    selectType: any;
    isArray: boolean = false;
    isObject: boolean = false;
    constructor(selectorInput: any) {

        if (util.checkArray(selectorInput) || util.checkObject(selectorInput)) {
            this.selector = new Selector();
            if (util.checkArray(selectorInput)) {
                this.isArray = true;
                this.selectType = new ArraySelector(selectorInput);
            } 
        } else {
            throw new Error('Provide array or object as an input to select');
        }
    }

    where(whereClause: any): this {
        return !util.isEmpty(whereClause) ? this.selectType.where(whereClause) : this;
    }

    concat(concatWith: any): this {
        return !util.isEmpty(concatWith) ? this.selectType.concat(concatWith) : this;
    }

    and(andOption: any): this {
        return !util.isEmpty(andOption) ? this.selectType.where(andOption) : this;
    }

    uniqueByKey(key: string): this {
        return !util.isEmpty(key) ? this.selectType.uniqueByKey(key) : this;
    }

    build(): Selector {
        return this.selector;
    }

}


class ArraySelector implements ISelector {
    selectorArray: any;
    constructor(select: any) {
        this.selectorArray = select;
    }

    /**
     * Like a map to iterate and pick an item by key
     * @param whereClause any type
     * @returns this
     */
    where(key: any, operator: Operators, value: any, notOption?: boolean): this {
        let returned = this.selectorArray;

        if (operator == Operators.EQUAL) {
            // Returned only one item where condition met
            returned = this.selectorArray.splice(this.selectorArray.findIndex((o) => {
                return o[key] == value;
            }), 1);
        } else if (operator == Operators.NOT_EQUAL) {
            // Remove all element except the key mentioned
            returned = this.selectorArray.filter(o => o[key] !== value);
        } else if (operator == Operators.GREATER_THAN) {
            returned = this.selectorArray.filter(o => o[key] > value);
        } else if (operator == Operators.GREATER_EQUAL) {
            returned = this.selectorArray.filter(o => o[key] >= value);
        } else if (operator == Operators.LESS_THEN) {
            returned = this.selectorArray.filter(o => o[key] < value);
        } else if (operator == Operators.LESS_THEN_EQUAL) {
            returned = this.selectorArray.filter(o => o[key] <= value);
        }

        if (returned) {
            // console.log(returned, 'retu');
            return returned
        } else {
            throw 'No Key found!';
        }
    }

    /**
     * Creates a new array concatenating array with any additional arrays and/or values.
     * @param concatWith array or value
     * @returns this
     */
    concat(concatWith: any): this {
        return this.selectorArray.concat(concatWith);
    }

    /**
     * option to filter by another predicate
     * @param andOption any
     * return this
     */
    and(key: any, operator: Operators, value: any): this {
        return this.where(key, operator, value);
    }

    /**
     * Creates an array of unique values, taking an iteratee to compute uniqueness with the provided key
     * @param key string
     * @returns 
     */
    uniqueByKey(key: string): this {
        let uniquArr: any = [];
        this.selectorArray.forEach((value, index) => {
            if (uniquArr.indexOf(value[key]) === -1) {
                uniquArr.push(value);

            }
        });
        return uniquArr;
    }
}
