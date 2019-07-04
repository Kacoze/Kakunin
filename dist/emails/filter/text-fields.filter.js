"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchers_1 = require("../../matchers");
const variable_store_helper_1 = require("../../web/variable-store.helper");
class TextFieldFilter {
    isSatisfiedBy(type) {
        return ['subject', 'from_email', 'from_name', 'to_email', 'to_name', 'html_body', 'text_body'].indexOf(type) !== -1;
    }
    filter(emails, type, value) {
        return emails.filter(email => {
            if (value.startsWith('r:')) {
                return matchers_1.regexBuilder.buildRegex(value).test(email[type]);
            }
            if (value.startsWith('t:')) {
                return new RegExp(RegExp.escape(variable_store_helper_1.default.replaceTextVariables(value.substr(2)))).test(email[type]);
            }
            throw new Error('Comparison type not specified. Please use r: for regex and t: for text');
        });
    }
}
exports.textFieldFilter = new TextFieldFilter();
