"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectHandler {
    constructor() {
        this.optionsSelector = by.css('option');
    }
    isSatisfiedBy(element) {
        return element.getTagName().then(tagName => tagName === 'select');
    }
    handleFill(page, elementName, desiredValue) {
        const self = this;
        const filteredByText = page
            .getElements(elementName)
            .all(this.optionsSelector)
            .filter(elem => elem.getText().then(text => text.trim() === desiredValue));
        return filteredByText.count().then(filteredByTextCount => {
            if (filteredByTextCount === 0) {
                const filteredByValue = page
                    .getElements(elementName)
                    .all(by.css('option'))
                    .filter(elem => elem.getAttribute('value').then(elemValue => elemValue === desiredValue));
                return filteredByValue.count().then(filteredByValueCount => {
                    if (filteredByValueCount === 0) {
                        return page[elementName]
                            .all(self.optionsSelector)
                            .first()
                            .click();
                    }
                    return filteredByValue.first().click();
                });
            }
            return filteredByText.first().click();
        });
    }
    handleCheck(page, elementName, desiredValue) {
        return page
            .getElement(elementName)
            .all(this.optionsSelector)
            .filter(element => element.getAttribute('value').then(elemValue => elemValue === desiredValue))
            .count()
            .then(count => {
            if (count === 1) {
                return Promise.resolve();
            }
            return Promise.reject('Option not found for select element.');
        });
    }
    getPriority() {
        return 998;
    }
}
exports.selectHandler = new SelectHandler();
