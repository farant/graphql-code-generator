"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definition_1 = require("graphql/type/definition");
var utils_1 = require("../utils/utils");
var pascalCase = require("pascal-case");
var ignoredScalars = ['Boolean', 'Float', 'String', 'ID', 'Int'];
exports.buildArgumentsType = function (primitivesMap, fieldName, typeName, argumentsArr) {
    if (argumentsArr === void 0) { argumentsArr = []; }
    var argsModel = {
        imports: [],
        name: pascalCase(fieldName) + typeName,
        fields: [],
        isEnum: false,
        isObject: true,
        isArgumentsType: true,
        isCustomScalar: false
    };
    argsModel.fields = argumentsArr.map(function (argDefinition) {
        var type = utils_1.getTypeName(primitivesMap, argDefinition.type);
        return {
            name: argDefinition.name,
            type: type,
            isArray: utils_1.isArray(argDefinition.type),
            isRequired: utils_1.isRequired(argDefinition.type)
        };
    });
    return argsModel;
};
exports.handleType = function (schema, primitivesMap, type) {
    var typeName = type['name'];
    var resultArr = [];
    var currentType = {
        imports: [],
        name: typeName,
        fields: [],
        isEnum: false,
        isObject: false,
        isCustomScalar: false
    };
    resultArr.push(currentType);
    if (!utils_1.shouldSkip(typeName)) {
        if (type instanceof definition_1.GraphQLEnumType) {
            currentType.isEnum = true;
            currentType.enumValues = type.getValues().map(function (enumItem) {
                return {
                    name: enumItem.name,
                    description: enumItem.description,
                    value: enumItem.value
                };
            });
        }
        else if (type instanceof definition_1.GraphQLObjectType || type instanceof definition_1.GraphQLInputObjectType || type instanceof definition_1.GraphQLInterfaceType) {
            currentType.isInput = type instanceof definition_1.GraphQLInputObjectType;
            currentType.isObject = true;
            var fields_1 = type.getFields();
            if (type instanceof definition_1.GraphQLObjectType) {
                currentType.implementedInterfaces = type.getInterfaces().map(function (interf) {
                    return interf.name;
                });
                currentType.hasImplementedInterfaces = currentType.implementedInterfaces.length > 0;
            }
            currentType.fields = Object
                .keys(fields_1)
                .map(function (fieldName) { return fields_1[fieldName]; })
                .map(function (field) {
                var type = utils_1.getTypeName(primitivesMap, field.type);
                var fieldArguments = field.args || [];
                if (fieldArguments.length > 0) {
                    resultArr.push(exports.buildArgumentsType(primitivesMap, field.name, typeName, fieldArguments));
                }
                if (!utils_1.isPrimitive(primitivesMap, type)) {
                    currentType.imports.push(type);
                }
                return {
                    name: field.name,
                    type: type,
                    isArray: utils_1.isArray(field.type),
                    isRequired: utils_1.isRequired(field.type)
                };
            });
        }
        else if (type instanceof definition_1.GraphQLUnionType) {
            currentType.name = type.name || typeName;
            currentType.isUnion = true;
            currentType.isObject = false;
            currentType.unionTypes = type.getTypes().map(function (type) { return type.name; });
            currentType.hasUnionTypes = currentType.unionTypes.length > 0;
        }
        else if (type instanceof definition_1.GraphQLList || type instanceof definition_1.GraphQLNonNull) {
            return exports.handleType(schema, primitivesMap, definition_1.getNamedType(type));
        }
        else if (type instanceof definition_1.GraphQLScalarType && ignoredScalars.indexOf(currentType.name) === -1) {
            currentType.isCustomScalar = true;
        }
        return resultArr;
    }
    else {
        return null;
    }
};
//# sourceMappingURL=model-handler.js.map