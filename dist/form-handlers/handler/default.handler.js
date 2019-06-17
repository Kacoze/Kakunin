"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultHandler {
    isSatisfiedBy() {
        return Promise.resolve(true);
    }
    handleFill(page, elementName, desiredValue) {
        return page
            .getElement(elementName)
            .isDisplayed()
            .then(() => page.getElement(elementName).clear())
            .then(() => page.getElement(elementName).sendKeys(desiredValue));
    }
    handleCheck(page, elementName, desiredValue) {
        return page
            .getElement(elementName)
            .isDisplayed()
            .then(() => {
            return page
                .getElement(elementName)
                .getAttribute('value')
                .then(value => {
                if (value === desiredValue) {
                    return Promise.resolve();
                }
                return Promise.reject(`Expected ${desiredValue} got ${value} for text input element ${elementName}`);
            });
        });
    }
    getPriority() {
        return 999;
    }
}
exports.defaultHandler = new DefaultHandler();
