"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClickableMatcher {
    isSatisfiedBy(prefix, name) {
        return prefix === 'f' && name === 'isClickable';
    }
    match(element) {
        return element
            .getAttribute('disabled')
            .then(disabled => ['disabled', true, 'true'].indexOf(disabled) === -1)
            .then(result => {
            if (result) {
                return true;
            }
            return Promise.reject(`
          Matcher "ClickableMatcher" could find attribute disabled on element "${element.locator()}".
        `);
        });
    }
}
exports.clickableMatcher = new ClickableMatcher();
