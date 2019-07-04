"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RadioHandler {
    isSatisfiedBy(element) {
        return element.getTagName().then(tagName => {
            if (tagName === 'input') {
                return element.getAttribute('type').then(inputType => inputType === 'radio');
            }
            if (tagName instanceof Array) {
                return element
                    .first()
                    .getAttribute('type')
                    .then(inputType => inputType === 'radio');
            }
            return false;
        });
    }
    handleFill(page, elementName, desiredValue) {
        const firstRadio = page
            .getElements(elementName)
            .filter(elem => elem.getAttribute('value').then(elemValue => elemValue === desiredValue))
            .first();
        return firstRadio.isDisplayed().then(isDisplayed => {
            if (isDisplayed) {
                return firstRadio.click();
            }
            return firstRadio.element(by.xpath('..')).click();
        });
    }
    handleCheck(page, elementName, desiredValue) {
        const filteredElements = page.getElements(elementName).filter(element => element.isSelected());
        return filteredElements.count().then(count => {
            if (desiredValue === '') {
                if (count === 0) {
                    return Promise.resolve();
                }
                return Promise.reject(`Expected count to be 0 got ${count}`);
            }
            return filteredElements
                .first()
                .getAttribute('value')
                .then(value => {
                if (value === desiredValue) {
                    return Promise.resolve();
                }
                return Promise.reject(`Expected ${desiredValue} got ${value} for radio element ${elementName}`);
            });
        });
    }
    getPriority() {
        return 998;
    }
}
exports.radioHandler = new RadioHandler();
