
import { SelectStatement, ISelector, Selector, ISelectBuilder, Operators, whereClauseArray } from './Selector'
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
                // this.selectType = new ArraySelector(selectorInput);
            }
        } else {
            throw new Error('Provide array or object as an input to select');
        }
    }


    /**
     * Like a map to iterate and pick an item by key and conditionally change array like object
     * @param expressionKey string or any key
     * @param expressionOperator Operator type operator
     * @param expressionValue  string or any value
     * @returns extracted array like object
     */
    where(expressionKey: any, expressionOperator: Operators, expressionValue: any) {
        let returned = this.selectType;

        // checks if any of the where clause is key/operator or value is empty
        if (util.isEmpty(expressionKey) || util.isEmpty(expressionOperator) || util.isEmpty(expressionValue)) {
            throw new Error ('WHERE expression not provided correctly!');
        }
        
        if (expressionOperator == Operators.EQUAL) {
            // Returned only one item where condition met
            returned = this.selectType.splice(this.selectType.findIndex((o) => {
                return o[expressionKey] == expressionValue;
            }), 1);
        } else if (expressionOperator == Operators.NOT_EQUAL) {
            // Remove all element except the key mentioned
            returned = this.selectType.filter(o => o[expressionKey] !== expressionValue);
        } else if (expressionOperator == Operators.GREATER_THAN) {
            returned = this.selectType.filter(o => o[expressionKey] > expressionValue);
        } else if (expressionOperator == Operators.GREATER_EQUAL) {
            returned = this.selectType.filter(o => o[expressionKey] >= expressionValue);
        } else if (expressionOperator == Operators.LESS_THEN) {
            returned = this.selectType.filter(o => o[expressionKey] < expressionValue);
        } else if (expressionOperator == Operators.LESS_THEN_EQUAL) {
            returned = this.selectType.filter(o => o[expressionKey] <= expressionValue);
        }

        if (returned) {
            // console.log(returned, 'retu');
            return returned
        } else {
            throw new Error('No correct WHERE expression found!');
        }
    }

     /**
     * Creates a new array concatenating array with any additional arrays and/or values.
     * @param concatWith array or value
     * @returns this
     */

    join(concatWith: any): this {
        return !util.isEmpty(concatWith) ? this.selectType.concat(concatWith) : this;
    }

    /**
     * another predicate which eventually calls where
     * @param expressionKey string or any key
     * @param expressionOperator Operator type operator
     * @param expressionValue  string or any value
     * @returns extracted array like object
     */
    and(expressionKey: any, expressionOperator: Operators, expressionValue: any) {
        return this.where(expressionKey, expressionOperator, expressionValue);
    }

   /**
     * Creates an array of unique values, taking an iteratee to compute uniqueness with the provided key
     * @param key string
     * @returns 
     */
    uniqueByKey(key: string): this {
        let uniquArr: any = [];
        this.selectType.forEach((value, index) => {
            if (uniquArr.indexOf(value[key]) === -1) {
                uniquArr.push(value);

            }
        });
        return uniquArr;
    }

    /**
     * if no condition met or null then client can return it's own input/object
     * @param input 
     * @returns client's provided input.
     */
    orElse(input: any) {
        if (!util.isEmpty(input)) {
            return input;
        }
    }

    /**
     * builder function 
     * @returns final object.
     */
    build(): Selector {
        return this.selector;
    }

}
