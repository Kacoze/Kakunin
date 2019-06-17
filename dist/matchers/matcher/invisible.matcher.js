"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvisibleMatcher {
    isSatisfiedBy(prefix, name) {
        return prefix === 'f' && name === 'isNotVisible';
    }
    async match(element) {
        try {
            await element.isDisplayed();
            return Promise.reject(`
        Matcher "InvisibleMatcher" could find element "${element.locator()}". Expected element to be invisible.
      `);
        }
        catch (err) {
            return true;
        }
    }
}
exports.invisibleMatcher = new InvisibleMatcher();
