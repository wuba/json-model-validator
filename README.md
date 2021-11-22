# json-model-validator

A flexible, lightweight JSON Data validator and formatter

## Usage

### Install

`npm i json-model-validator`

### Declare json model

```ts
import {
    JSONModel,
    JSONMember,
    FIELD_TYPE,
} from 'json-model-validator';

@JSONModel
class SubSubModel {
    @JSONMember(FIELD_TYPE.ANY)
    subsub: any;
}

@JSONModel
class TestSubModel {
    @JSONMember(FIELD_TYPE.ANY)
    uuid: any;
    @JSONMember(SubSubModel)
    sub: SubSubModel;
}

@JSONModel
class TestModel {
    @JSONMember(FIELD_TYPE.NUMBER)
    uid: any;

    @JSONMember(FIELD_TYPE.STRING)
    code: string;

    // use custom formatter
    @JSONMember(FIELD_TYPE.ARRAY(String), (cateIds) => cateIds.split(','))
    cateIds: string;

    @JSONMember(TestSubModel)
    t: TestSubModel;
}
```

### Validation

```ts
import JSONValidator from 'json-model-validator',

console.log(
    JSONValidator(TestModel, 
        { 
            uid: '0',
            cateIds: '0,1', 
            t: { 
                uuid: 0 
            } 
        }
    )
);
//  throw ValidationError, errorList
//  [ 'The value of property "uid" should be a Number, now it is a string (0)',
//   'The value of property "code" should not be undefined',
//   'The value of property "sub" should not be undefined' ]

console.log(
    JSONValidator(TestModel, 
        { 
            uid: [0], 
            cateIds: '0,1', 
            t: { 
                sub: { 
                    subsub: 0 
                } 
            } 
        }
    )
);
// {"t":{"sub":{"subsub":0},"uuid":""},"uid":0,"cateIds":["0","1"]}

```
## Running Sample

Press F5 under VScode to start the sample.
## Developing

Save the file `src/index.ts` changes, and running sample.

## Contributing

You are welcome to submit your PR or Issue for feedback and questions.
## TODO list

- [ ] validation stack
- [ ] i18n
- [ ] unit test
- [ ] ts interface to model