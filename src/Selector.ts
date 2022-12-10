
export interface ISelector {
        where(key: any, operator: Operators, value: any): this
        join(concatWith: any): this
        and(key: any, operator: Operators, value: any): this
        uniqueByKey(key: string): this
        build(): Selector
}

export default class Selector {
        data: any = [] || {} || null;

        construction(): any {
            return this.data;
        }
    }

export enum Operators {
        EQUAL = '==',
        NOT_EQUAL = '!=',
        GREATER_THAN = '>',
        GREATER_EQUAL = '>=',
        LESS_THEN = '<',
        LESS_THEN_EQUAL = '<=',
      }