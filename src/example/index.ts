import JSONValidator, { JSONModel, JSONMember, FIELD_TYPE, ArrayValidator } from '../index';
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

    @JSONMember(FIELD_TYPE.ARRAY(String), (cateIds) => cateIds.split(','))
    cateIds: string;

    @JSONMember(TestSubModel)
    t: TestSubModel;
}
try {
    console.log(JSONValidator(TestModel, { uid: '0', cateIds: '0,1', t: { uuid: 0 } }));
} catch (error) {
    console.log(error.list);
}
try {
    // 期望 uuid 当前值 undefined
    console.log(JSONValidator(TestModel, { uid: 0, code:'233',cateIds: '0,1', t: { sub: { subsub: 0 } } }));
} catch (error) {
    console.log(error);

    // console.log(error.list);
}

console.log('end');
