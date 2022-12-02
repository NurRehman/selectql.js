
export interface SelectStatement {
        where: any,
        concat: any,
        and: any,
        uniqueByKey: any
}

export interface ISelector {
        where(key: any, operator: Operators, value: any, notOption?: boolean): this
        concat(concatWith: any): this
        and(key: any, operator: Operators, value: any): this
        uniqueByKey(key: string): this
}

export interface ISelectBuilder extends ISelector {
        build(): Selector
}

export class Selector {
        data: any = [] || {} || null;
}

export enum Operators {
        EQUAL = '==',
        NOT_EQUAL = '!==',
        GREATER_THAN = '>',
        GREATER_EQUAL = '>=',
        LESS_THEN = '<',
        LESS_THEN_EQUAL = '<=',
      }