
import { SelectStatement, ISelector, Selector, ISelectBuilder } from './Selector'
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
            } else if (util.checkObject(selectorInput)) {
                this.isObject = true;
                this.selectType = new ObjectSelector(selectorInput);
            }
            //this.selectInput = selectorInput;
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

    not(notOption: any): this {
        return !util.isEmpty(notOption) ? this.selectType.where(notOption) : this;
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
    where(whereClause: any, notOption?: boolean): this {
        const whereFilter = this.selectorArray.filter((x) => {
            return (notOption) ? x !== whereClause : x === whereClause;
        });
        return whereFilter;
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
    and(andOption: any): this {
        return this.where(andOption);
    }

    /**
     * option to not filter by predicate key
     * @param andOption any
     * return this
     */
    not(notOption: any): this {
        return this.where(notOption, true);
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

class ObjectSelector implements ISelector {
    selectorObject: any;
    constructor(select: any) {
        this.selectorObject = select;
    }
    /**
     * Creates an object composed of the object properties predicate 
     * returns truthy for.
     * @param whereClause any type
     * @returns this
     */
    where(whereClause: any, notOption?: boolean): this {
        const whereFilter = whereClause.reduce((obj, key) => {
            if (this.selectorObject && this.selectorObject.hasOwnProperty(key)) {
                if (notOption) {
                    obj[key] != this.selectorObject[key];
                } else {
                    obj[key] = this.selectorObject[key];
                }

            }
            return obj;
        }, {});
        return whereFilter;
    }

    /**
     * copies all the properties from source to target object.
     * @param concatWith object
     * return this
     */
    concat(concatWith: any): this {
        return Object.assign(concatWith, this.selectorObject);
    }

    /**
     * option to filter by another predicate
     * @param andOption any
     * return this
     */
    and(andOption: any): this {
        return this.where(andOption);
    }

    /**
     * option to not filter by predicate key
     * @param andOption any
     * return this
     */
    not(notOption: any): this {
        return this.where(notOption, true);
    }

    /**
     * Creates an array of unique values, taking an iteratee to compute uniqueness with the provided key
     * @param key string
     * @returns 
     */
    uniqueByKey(key: string): this {
        let uniquArr: any = [];
        this.selectorObject.forEach((value, index) => {
            if (uniquArr.indexOf(value[key]) === -1) {
                uniquArr.push(value);

            }
        });
        return uniquArr;
    }
}

// export class SqlSelect {

//     public selectStatement: SelectStatement;

//     public selectObject: any;
//     public selectDistinct: any;
//     public whereOption: any;
//     public andOpterator: any;
//     public orOperator: any;
//     public notOperator: any;
//     public orderByKeyword: any;


//     constructor(
//         {
//             url,
//             headers,
//             auth,
//             calls,
//             batchResponseType = 'json',
//             individualResponseType = 'json'
//         }:
//             {
//                 url: string,
//                 headers?: any;
//                 auth: string,
//                 calls?: any,
//                 batchResponseType?: string,
//                 individualResponseType?: string
//             },
//         batchRepository: ODataBatchRepository = new ODataBatchAxiosRepository()
//     ) {

//         this.ensureHasCalls(calls);

//         this.boundary = new Date().getTime().toString();

//         this.headers = headers;
//         this.auth = auth;
//         this.url = url;
//         this.batchRepository = batchRepository;

//         this.requestResponseType = {
//             contentType: batchResponseType === 'json' ? 'application/json' : 'application/xml',
//             accept: individualResponseType === 'json' ? 'application/json' : 'application/xml',
//         };

//         this.batchRequest = requestsToBatch(calls, this.boundary, this.requestResponseType);
//     }

//     public send() {
//         const config = {
//             headers: {
//                 ...this.headers,

//                 Authorization: this.headers.Authorization || `Basic ${this.auth}`,
//                 Accept: this.requestResponseType.accept,
//                 'Content-Type': 'multipart/mixed; boundary=batch_' + this.boundary
//             },
//         };

//         return this.batchRepository.send(
//             this.url,
//             this.batchRequest,
//             config,
//             this.requestResponseType.accept,
//             BatchResponse
//         );
//     }

//     private ensureHasCalls(data: any[]) {
//         if (data.length <= 0) {
//             throw new Error('No calls have been passed');
//         }
//     }
// }