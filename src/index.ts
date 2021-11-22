/* eslint-disable max-classes-per-file */
import 'reflect-metadata';

class ValidationError extends Error {
    list;

    constructor(message, errors?) {
        super(message);
        this.name = 'ValidationError';
        this.list = errors || [];
    }
}

const ArrayMember = (member) => {
    class ArrayMember {}
    Reflect.defineMetadata('isArrayMember', true, ArrayMember);
    Reflect.defineMetadata('member', member, ArrayMember);
    return ArrayMember;
};

export const FIELD_TYPE: any = {
    ANY: 'any',
    ARRAY: ArrayMember,
    STRING: String,
    NUMBER: Number,
    BOOLEAN: Boolean,
};

/** 模型声明装饰器 */
export const JSONModel = (constructor: Function) => {
    Reflect.defineMetadata('toBeValidate', true, constructor);
};

/** 模型字段装饰器 */
export const JSONMember = (type, formatter?: Function) => (target: object, key: string) => {
    let realType = type;
    const formatterKey = `${key}_formatter`;

    if (type!=='any'&&Reflect.getMetadata('isArrayMember', type) === true) {
        realType = Array;
        const memberType = Reflect.getMetadata('member', type);
        Reflect.defineMetadata(`${key}_array_type`, memberType, target.constructor);
    }

    const keys = Reflect.getMetadata('keys', target.constructor) || [];
    Reflect.defineMetadata('keys', [...keys, key], target.constructor);
    Reflect.defineMetadata(Symbol.for(key), realType, target.constructor);
    Reflect.defineMetadata(formatterKey, formatter, target.constructor);
};

const handler = (model, errors, currentKey) => ({
    set(obj, prop, value) {
        const valueType = Reflect.getMetadata(Symbol.for(prop), model);
        const formatter = Reflect.getMetadata(`${prop}_formatter`, model);

        if (formatter !== undefined) {
            try {
                value = formatter(value);
            } catch (error) {
                throw new ValidationError(`自定义默认值处理函数 ${formatter.toString()} 执行失败`);
            }
        }

        if (valueType.name === 'Array') {
            const arrayType = Reflect.getMetadata(`${prop}_array_type`, model);
            obj[prop] = ArrayValidator(arrayType, value, prop, errors);
        } else {
            validator(valueType, value, prop, errors)
        }
        return true;
    },
});

// TODO: 独立 stack
const JSONValidator = (
    model: Function,
    source,
    target = undefined,
    currentKey = 'data',
    errors = []
) => {
    if (typeof source !== 'object') {
        errors.push(`待检查的数据 ${currentKey} 应为 ${model.name} 对象，当前值为 ${source}`);
    }

    const keys = Reflect.getMetadata('keys', model);

    if (target === undefined) target = new Proxy({}, handler(model, errors, currentKey));

    keys.map((key) => {
        target[key] = source[key];
    })

    if (errors.length > 0) throw new ValidationError('JSON校验未通过', errors);

    return target;
};

export const ArrayValidator = (model, source: Array<any>, currentKey = 'data', errors = []) => {
    const target = source.map((item) => {
        return validator(model, item, currentKey, errors);
    });
    return target;
};

const validator = (type, sourceData, currentKey, errors) => {
    if (typeof sourceData === 'object') {
        return Reflect.getMetadata('toBeValidate', type)
            ? JSONValidator(type, sourceData, undefined, currentKey, errors)
            : sourceData;
    } else {
        return baseTypeValidator(type, sourceData, currentKey, errors);
    }
};

const baseTypeValidator = (type, value, currentKey, errors) => {
    if(type === 'any' && value !== undefined) {
        return value;
    }
    if(value === undefined || type.name === undefined){
        errors.push(`The value of property "${currentKey}" should not be undefined`);
        return false;
    }
    if ((typeof value).toLowerCase() !== type.name.toLowerCase()) {
        errors.push(`The value of property "${currentKey}" should be a ${type.name}, now it is a ${typeof value} (${value})`);
        return false;
    }
    return value;
};

export default JSONValidator;
