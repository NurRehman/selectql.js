
import { ISelector, Operators, Select } from './Selector'
import * as util from './utils'

/**
 * Select  implementation
 */
export class SelectQL implements ISelector {
    // The Concrete Builder
    data: any = [];
    private _isArray: boolean = true;
    constructor(selectorInput: any) {

        if (util.checkArray(selectorInput) || util.checkObject(selectorInput)) {
            this.data = selectorInput;
            if (util.checkArray(selectorInput)) {
                this._isArray = true;
            }
        } else {
            throw new Error('Provide array or object as an input to select');
        }
    }


    /**
     *  As per SQL definition The WHERE clause is used to filter records. 
     *  It is used to extract only those records that fulfill a specified condition.
     * @param expressionKey string or any key
     * @param expressionOperator Operator type operator
     * @param expressionValue  string or any value
     * @returns extracted array like object
     */
    where(expressionKey: any, expressionOperator: Operators, expressionValue: any): this {
        let filtered = this._filteredBody(expressionKey, expressionOperator, expressionValue);
        if (filtered) {
            this.data = filtered;
            // console.log(returned, 'retu');
            return this;
        } else {
            throw new Error('WHERE expression not correctly passed!');
        }
    }

    /**
     * where like function a predicate which will eventually use WHERE method
     * @param expressionKey string or any key
     * @param expressionOperator Operator type operator
     * @param expressionValue  string or any value
     * @returns extracted array like object
     */
    and(expressionKey: any, expressionOperator: Operators, expressionValue: any): this {
        let filtered = this._filteredBody(expressionKey, expressionOperator, expressionValue);
        if (filtered) {
            this.data = filtered;
            // console.log(returned, 'retu');
            return this;
        } else {
            throw new Error('AND expression not correctly passed!');
        }
    }

    /**
     * private member to be used in WHERE and AND methods
     * @param expressionKey 
     * @param expressionOperator 
     * @param expressionValue 
     * @returns filtered object of array
     */
    private _filteredBody(expressionKey: any, expressionOperator: Operators, expressionValue: any): this {
        let returned = this.data;

        // checks if any of the where/and clause is key/operator or value is empty
        if (util.isEmpty(expressionKey) || util.isEmpty(expressionOperator) || util.isEmpty(expressionValue)) {
            throw new Error('Expression mandatory syntax missing!');
        }

        if (expressionOperator == Operators.EQUAL) {
            // Returned only one item where condition met
            returned = this.data.splice(this.data.findIndex((o) => {
                return o[expressionKey] == expressionValue;
            }), 1);
        } else if (expressionOperator == Operators.NOT_EQUAL) {
            // Remove all element except the key mentioned
            returned = this.data.filter(o => o[expressionKey] !== expressionValue);
        } else if (expressionOperator == Operators.GREATER_THAN) {
            returned = this.data.filter(o => o[expressionKey] > expressionValue);
        } else if (expressionOperator == Operators.GREATER_EQUAL) {
            returned = this.data.filter(o => o[expressionKey] >= expressionValue);
        } else if (expressionOperator == Operators.LESS_THEN) {
            returned = this.data.filter(o => o[expressionKey] < expressionValue);
        } else if (expressionOperator == Operators.LESS_THEN_EQUAL) {
            returned = this.data.filter(o => o[expressionKey] <= expressionValue);
        }

        return returned;
    }

    /**
    * Creates a new array concatenating array with any additional arrays and/or values.
    * @param concatWith array or value
    * @returns this
    */

    join(concatWith: any): this {
        this.data = !util.isEmpty(concatWith) ? this.data.concat(concatWith) : this;
        return this;
    }



    /**
      * Creates an array of unique values, taking an iteratee to compute uniqueness with the provided key
      * @param key string
      * @returns 
      */
    uniqueByKey(key: string): this {
        let uniquArr: any = [];
        this.data.forEach((value, index) => {
            if (uniquArr.indexOf(value[key]) === -1) {
                uniquArr.push(value);

            }
        });
        return this;
    }

    /**
     * if no condition met or null then client can return it's own input/object
     * @param input 
     * @returns client's provided input.
     */
    ifEmptyThen(input: any): this {
        if (!this.data || util.isEmpty(this.data) || !this.data.length) {
            this.data = input
        }
        return this;
    }

    /**
     * builder function 
     * @returns final object.
     */
    build(): this {
        let selectedData: any = new Select(this);
        return selectedData.data;
    }

}
