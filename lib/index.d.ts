import 'reflect-metadata';
export declare const FIELD_TYPE: any;
export declare const JSONModel: (constructor: Function) => void;
export declare const JSONMember: (type: any, formatter?: Function) => (target: object, key: string) => void;
declare const JSONValidator: (model: Function, source: any, target?: any, stack?: string[], errors?: any[]) => any;
export declare const ArrayValidator: (model: any, source: Array<any>, stack?: string[], errors?: any[]) => any[];
export default JSONValidator;
