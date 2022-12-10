
import Selector, { ISelector, Operators } from './Selector'
import * as util from './utils'

export default class SelectQL implements ISelector {
    // The Concrete Builder
    selector: Selector;
    selectedInput: any;
    isArray: boolean = false;
    data: any = [];
    constructor(selectorInput: any) {

        if (util.checkArray(selectorInput) || util.checkObject(selectorInput)) {
            this.selector = new Selector();
            this.data = selectorInput;
            if (util.checkArray(selectorInput)) {
                this.isArray = true;
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
    where(expressionKey: any, expressionOperator: Operators, expressionValue: any) : this {
        let returned = this.selectedInput;

        // checks if any of the where clause is key/operator or value is empty
        if (util.isEmpty(expressionKey) || util.isEmpty(expressionOperator) || util.isEmpty(expressionValue)) {
            throw new Error ('WHERE expression not provided correctly!');
        }
        
        if (expressionOperator == Operators.EQUAL) {
            // Returned only one item where condition met
            returned = this.selectedInput.splice(this.selectedInput.findIndex((o) => {
                return o[expressionKey] == expressionValue;
            }), 1);
        } else if (expressionOperator == Operators.NOT_EQUAL) {
            // Remove all element except the key mentioned
            returned = this.selectedInput.filter(o => o[expressionKey] !== expressionValue);
        } else if (expressionOperator == Operators.GREATER_THAN) {
            returned = this.selectedInput.filter(o => o[expressionKey] > expressionValue);
        } else if (expressionOperator == Operators.GREATER_EQUAL) {
            returned = this.selectedInput.filter(o => o[expressionKey] >= expressionValue);
        } else if (expressionOperator == Operators.LESS_THEN) {
            returned = this.selectedInput.filter(o => o[expressionKey] < expressionValue);
        } else if (expressionOperator == Operators.LESS_THEN_EQUAL) {
            returned = this.selectedInput.filter(o => o[expressionKey] <= expressionValue);
        }

        if (returned) {
            this.data = returned;
            // console.log(returned, 'retu');
            return this.data;
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
        return this.data = !util.isEmpty(concatWith) ? this.selectedInput.concat(concatWith) : this;
    }

    /**
     * another predicate which eventually calls where
     * @param expressionKey string or any key
     * @param expressionOperator Operator type operator
     * @param expressionValue  string or any value
     * @returns extracted array like object
     */
    and(expressionKey: any, expressionOperator: Operators, expressionValue: any): this {
        return this.data = this.where(expressionKey, expressionOperator, expressionValue);
    }

   /**
     * Creates an array of unique values, taking an iteratee to compute uniqueness with the provided key
     * @param key string
     * @returns 
     */
    uniqueByKey(key: string): this {
        let uniquArr: any = [];
        this.selectedInput.forEach((value, index) => {
            if (uniquArr.indexOf(value[key]) === -1) {
                uniquArr.push(value);

            }
        });
        return this.data = uniquArr;
    }

    /**
     * if no condition met or null then client can return it's own input/object
     * @param input 
     * @returns client's provided input.
     */
    orElse(input: any) {
       return this.data = input;
    }

    /**
     * builder function 
     * @returns final object.
     */
    build(): Selector {
        return this.selector;
    }

}
