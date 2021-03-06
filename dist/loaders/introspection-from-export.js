"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var schema_1 = require("graphql/type/schema");
var graphql_1 = require("graphql");
exports.introspectionFromExport = function (file) {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(file)) {
            try {
                var schema = require(file);
                if (schema && schema instanceof schema_1.GraphQLSchema) {
                    resolve(graphql_1.graphql(schema, graphql_1.introspectionQuery).then(function (res) { return res.data; }));
                }
                else {
                    reject(new Error("Invalid export from export file " + file + ", make sure to default export your GraphQLSchema object!"));
                }
            }
            catch (e) {
                reject(e);
            }
        }
        else {
            reject("Unable to locate introspection export file: " + file);
        }
    });
};
//# sourceMappingURL=introspection-from-export.js.map