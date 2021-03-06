"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var getConfig = function (generatorPath) {
    var dirString = __dirname;
    var configPath = path.resolve(dirString, generatorPath, 'config.json');
    var config = (JSON.parse(fs.readFileSync(configPath, 'utf8')));
    config.basePath = generatorPath;
    return config;
};
exports.getGenerators = function () {
    return [
        {
            language: 'TypeScript Single File',
            aliases: ['ts', 'typescript', 'ts-single', 'typescript-single'],
            config: getConfig('../../generators/typescript-single-file/')
        },
        {
            language: 'TypeScript Multiple Files',
            aliases: ['ts-multiple', 'typescript-multiple'],
            config: getConfig('../../generators/typescript-multiple-files/')
        },
        {
            language: 'Flow Single File',
            aliases: ['flow', 'flow-single'],
            config: getConfig('../../generators/flow-single-file/')
        },
        {
            language: 'Swift (Apollo) Single File',
            aliases: ['swift', 'swift-apollo', 'swift-single'],
            config: getConfig('../../generators/swift-apollo-single-file/')
        }
    ];
};
//# sourceMappingURL=templates.js.map