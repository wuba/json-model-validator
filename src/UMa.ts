/** 一键生成Model对象 */
// const UMaModel = createArgDecorator((modelName: string, ctx: IContext) => {
// const Ctor = modelMap.get(modelName); // 获取model对应的构造函数
// const fields = modelMap.get(`${modelName}_fields`)||[]; // 获取model上所注册的字段
// const defaultFields = modelMap.get(`${modelName}_default_fields`)||[]; // 获取model上所注册的字段
// const transData = ctx.method === 'POST' ? ctx.request.body : ctx.query;// 获取接口传输的数据
// const model = new Ctor(); // model
// const errList = [];
// // 生成 model 数据项
// for (let i = 0; i < fields.length; i++) {
//     const field = fields[i];
//     const checkResult = modelFieldValidator(modelName, field, transData[field]);
//     if (checkResult === true) { // 数据类型校验
//         model[field] = transData[field];
//     } else {
//         errList.push(checkResult);
//     }
// }
// for (let i = 0; i < defaultFields.length; i++) {
//     const field = defaultFields[i];
//     const checkResult = modelFieldValidator(modelName, field, transData[field]);
//     const TypeConstructor = modelMap.get(`${modelName}_${field}`);
//     model[field] = checkResult===true? transData[field] : new TypeConstructor();
// }
// return errList.length === 0 ? model : Result.json(errList);
// });