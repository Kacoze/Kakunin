"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomAngularSelectHandler {
    constructor() {
        this.optionsSelector = by.css('ul.ui-select-choices li a.ui-select-choices-row-inner');
        this.selectedOptionSelector = by.css('div.ui-select-match .ui-select-match-text');
    }
    isSatisfiedBy(element, elementName) {
        return Promise.resolve(elementName.endsWith('CustomAngularSelect'));
    }
    handleFill(page, elementName, desiredValue) {
        return browser
            .executeScript('arguments[0].scrollIntoView(false);', page[elementName].getWebElement())
            .then(() => page[elementName].click())
            .then(() => {
            const filtered = page[elementName]
                .all(this.optionsSelector)
                .filter(elem => elem.getText().then(text => text === desiredValue));
            return filtered.count().then(count => {
                if (count === 0) {
                    return page[elementName]
                        .all(this.optionsSelector)
                        .first()
                        .click();
                }
                return filtered.first().click();
            });
        });
    }
    handleCheck(page, elementName, desiredValue) {
        return page[elementName]
            .element(this.selectedOptionSelector)
            .getText()
            .then(text => {
            if (text === desiredValue) {
                return Promise.resolve();
            }
            return Promise.reject(`Expected ${desiredValue} got ${text} for select element ${elementName}`);
        });
    }
    getPriority() {
        return 998;
    }
}
exports.customAngularSelectHandler = new CustomAngularSelectHandler();
