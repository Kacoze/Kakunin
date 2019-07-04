"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regex_builder_1 = require("./regex-matcher/regex-builder");
class AttributeMatcher {
    isSatisfiedBy(prefix) {
        return prefix === 'attribute';
    }
    match(element, attributeName, regexName) {
        return element.getAttribute(attributeName).then(value => {
            if (regex_builder_1.regexBuilder.buildRegex(`r:${regexName}`).test(value)) {
                return true;
            }
            const transformedRegexName = `r:${regexName}`;
            return Promise.reject(`
        Matcher "AttributeMatcher" could not match regex on element "${element.locator()}" on attribute "${attributeName}". 
        Expected to match: "${regex_builder_1.regexBuilder.buildRegex(transformedRegexName).toString()}", Given: "${value}"
      `);
        });
    }
}
exports.attributeMatcher = new AttributeMatcher();
