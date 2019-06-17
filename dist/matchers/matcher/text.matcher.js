"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchers_1 = require("../matchers");
class TextMatcher {
    isSatisfiedBy(prefix) {
        return prefix === 't';
    }
    match(element, ...params) {
        const expectedValue = params.join(matchers_1.separator);
        return element.getTagName().then(tag => {
            if (tag === 'input' || tag === 'textarea') {
                return element.getAttribute('value').then(value => {
                    if (new RegExp(RegExp.escape(expectedValue)).test(value)) {
                        return true;
                    }
                    return Promise.reject(`
            Matcher "TextMatcher" could not match value on element "${element.locator()}".
            Expected: "${expectedValue}", Given: "${value}"
          `);
                });
            }
            return element.getText().then(text => {
                if (new RegExp(RegExp.escape(expectedValue)).test(text)) {
                    return true;
                }
                return Promise.reject(`
          Matcher "TextMatcher" could not match value on element "${element.locator()}".
          Expected: "${expectedValue}", Given: "${text}"
        `);
            });
        });
    }
}
exports.textMatcher = new TextMatcher();
