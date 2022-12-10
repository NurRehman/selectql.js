import { SelectQL } from "./SelectQL";
export interface ISelector {
        where(key: any, operator: Operators, value: any): this
        join(concatWith: any): this
        and(key: any, operator: Operators, value: any): this
        uniqueByKey(key: string): this
        build(): this
}

export enum Operators {
        EQUAL = '==',
        NOT_EQUAL = '!=',
        GREATER_THAN = '>',
        GREATER_EQUAL = '>=',
        LESS_THEN = '<',
        LESS_THEN_EQUAL = '<=',
}

/**
 * The definition of the Builder Pattern is a separation of the 
 * construction of a complex object from its representation.
 * 
 */
export class Select {
        data: any[] = [];

        constructor(selectQl: SelectQL) {
                this.data = selectQl.data;
        }
}