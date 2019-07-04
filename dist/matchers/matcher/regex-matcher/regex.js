"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_loader_helper_1 = require("../../../core/modules-loader.helper");
const default_1 = require("./regexes/default");
const modulesLoader = modules_loader_helper_1.create();
const availableRegexes = modulesLoader.getModules('regexes');
const regularExpressions = availableRegexes.reduce((regexes, newRegexes) => ({ ...regexes, ...newRegexes }), {
    ...default_1.regex,
});
exports.default = regularExpressions;
