"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regex_1 = require("./regex");
const regex_builder_1 = require("./regex-builder");
class RegexMatcher {
    isSatisfiedBy(prefix, name) {
        return prefix === 'r' && typeof regex_1.default[name] !== 'undefined';
    }
    match(element, regexName) {
        return element.getText().then(text => {
            return element.getAttribute('value').then(value => {
                const regularExpression = regex_builder_1.regexBuilder.buildRegex(`r:${regexName}`);
                if (text === '') {
                    if (value === null) {
                        return Promise.reject(`
                  Matcher "RegexMatcher" could not match value for element "${element.locator()}".
                  Both text and attribute value are empty.
                `);
                    }
                    if (regularExpression.test(value)) {
                        return true;
                    }
                    return Promise.reject(`
                Matcher "RegexMatcher" could not match regex on element "${element.locator()}" on value "${value}". 
                Expected to match: "${regularExpression.toString()}", Given: "${value}"
              `);
                }
                if (regularExpression.test(text)) {
                    return true;
                }
                return Promise.reject(`
              Matcher "RegexMatcher" could not match regex on element "${element.locator()}" on text "${text}". 
              Expected to match: "${regularExpression.toString()}", Given: "${text}"
            `);
            });
        });
    }
}
exports.regexMatcher = new RegexMatcher();
