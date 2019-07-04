"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regex_1 = require("./regex");
class RegexBuilder {
    buildRegex(regexTemplate) {
        for (const property in regex_1.default) {
            if (regex_1.default.hasOwnProperty(property) && regexTemplate === 'r:' + property) {
                return new RegExp(regex_1.default[property]);
            }
        }
        throw new Error('Regex with template ' + regexTemplate + ' was not found');
    }
}
exports.regexBuilder = new RegexBuilder();
