"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeFromAST_1 = require("graphql/utilities/typeFromAST");
var utils_1 = require("../utils/utils");
var printer_1 = require("graphql/language/printer");
var inner_models_builer_1 = require("./inner-models-builer");
exports.buildVariables = function (schema, definitionNode, primitivesMap) {
    return definitionNode.variableDefinitions.map(function (variableDefinition) {
        var typeFromSchema = typeFromAST_1.typeFromAST(schema, variableDefinition.type);
        return {
            name: variableDefinition.variable.name.value,
            type: utils_1.getTypeName(primitivesMap, typeFromSchema),
            isArray: utils_1.isArray(typeFromSchema),
            isRequired: utils_1.isRequired(typeFromSchema)
        };
    });
};
var counter = 0;
var generateAnonymous = function (type) {
    console.warn("Your documents definition has anonymous " + type + " - please name it for better result!");
    counter++;
    return "Anonymous_" + counter + "_";
};
exports.handleOperation = function (schema, definitionNode, primitivesMap, flattenInnerTypes) {
    if (flattenInnerTypes === void 0) { flattenInnerTypes = false; }
    var type = definitionNode.operation;
    var name = (definitionNode.name || { value: generateAnonymous(type) }).value;
    var root = utils_1.getRoot(schema, definitionNode);
    var typesMap = {
        query: (schema.getQueryType() || { name: 'Query' }).name,
        subscription: (schema.getSubscriptionType() || { name: 'Subscription' }).name,
        mutation: (schema.getMutationType() || { name: 'Mutation' }).name,
    };
    var builtName = utils_1.buildName(typesMap, name, type);
    var document = {
        name: builtName,
        rawName: name,
        isQuery: type === 'query',
        isSubscription: type === 'subscription',
        isMutation: type === 'mutation',
        isFragment: false,
        variables: [],
        innerTypes: [],
        hasVariables: false,
        hasInnerTypes: false,
        rootType: [],
        imports: [],
        document: printer_1.print(definitionNode)
    };
    document.variables = exports.buildVariables(schema, definitionNode, primitivesMap);
    document.innerTypes = inner_models_builer_1.buildInnerModelsArray(schema, root, flattenInnerTypes, definitionNode.selectionSet, primitivesMap);
    document.rootType = [document.innerTypes.find(function (i) { return i.isRoot; })];
    document.hasVariables = document.variables.length > 0;
    document.hasInnerTypes = document.innerTypes.length > 0;
    document.variables.forEach(function (field) {
        if (field.type && !utils_1.isPrimitive(primitivesMap, field.type)) {
            document.imports.push(field.type);
        }
    });
    return document;
};
//# sourceMappingURL=operation-handler.js.map