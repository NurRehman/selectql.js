
export interface SelectStatement {
        where: any,
        concat: any,
        and: any,
        not: any,
        uniqueByKey: any
}

export interface ISelector {
        where(whereClause: any): this
        concat(concatWith: any): this
        and(andOption: any): this
        not(notOption: any): this
        uniqueByKey(key: string): this
}

export interface ISelectBuilder extends ISelector {
        build(): Selector
}

export class Selector {
        data: any = [] || {} || null;
}