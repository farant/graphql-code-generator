"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var model_handler_1 = require("../handlers/model-handler");
var operation_handler_1 = require("../handlers/operation-handler");
var fragment_handler_1 = require("../handlers/fragment-handler");
exports.prepareCodegen = function (schema, document, primitivesMap, config) {
    if (primitivesMap === void 0) { primitivesMap = {}; }
    if (config === void 0) { config = {}; }
    var models = [];
    var documents = [];
    var typesMap = schema.getTypeMap();
    Object.keys(typesMap).forEach(function (typeName) {
        models.push.apply(models, model_handler_1.handleType(schema, primitivesMap, typesMap[typeName]));
    });
    if (!config.noDocuments) {
        document.definitions.forEach(function (definition) {
            switch (definition.kind) {
                case graphql_1.Kind.OPERATION_DEFINITION:
                    documents.push(operation_handler_1.handleOperation(schema, definition, primitivesMap, config.flattenInnerTypes));
                    break;
                case graphql_1.Kind.FRAGMENT_DEFINITION:
                    documents.push(fragment_handler_1.handleFragment(schema, definition, primitivesMap, config.flattenInnerTypes));
                    break;
                default:
                    break;
            }
        });
    }
    return {
        models: models.filter(function (item) {
            if (item) {
                return !(config.noSchema && !item.isEnum);
            }
            return false;
        }),
        documents: documents.filter(function (item) { return item; })
    };
};
//# sourceMappingURL=codegen.js.map