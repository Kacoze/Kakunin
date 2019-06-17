"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regex_builder_1 = require("./matcher/regex-matcher/regex-builder");
const matchers_1 = require("./matchers");
exports.matchers = matchers_1.create();
exports.regexBuilder = regex_builder_1.regexBuilder;
