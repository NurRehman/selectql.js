
export interface SelectStatement {
        where: any,
        join: any,
        and: any,
        uniqueByKey: any
}

export interface ISelector {
        where(key: any, operator: Operators, value: any): this
        join(concatWith: any): this
        and(key: any, operator: Operators, value: any): this
        uniqueByKey(key: string): this
}
export interface whereClauseArray {
        key: any;
        operator: Operators;
        value: any;
}

export interface ISelectBuilder extends ISelector {
        build(): Selector
}

export class Selector {
        data: any = [] || {} || null;
}

export enum Operators {
        EQUAL = '=',
        NOT_EQUAL = '!=',
        GREATER_THAN = '>',
        GREATER_EQUAL = '>=',
        LESS_THEN = '<',
        LESS_THEN_EQUAL = '<=',
      }