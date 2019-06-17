"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckboxHandler {
    isSatisfiedBy(element) {
        return element.getTagName().then(tagName => {
            if (tagName === 'input') {
                return element.getAttribute('type').then(inputType => inputType === 'checkbox');
            }
            if (tagName instanceof Array) {
                return element
                    .first()
                    .getAttribute('type')
                    .then(inputType => inputType === 'checkbox');
            }
            return false;
        });
    }
    handleFill(page, elementName, desiredValue) {
        return page
            .getElements(elementName)
            .filter(elem => {
            return elem
                .element(by.xpath('..'))
                .getText()
                .then(text => {
                return text.trim() === desiredValue;
            });
        })
            .first()
            .click();
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
            return page
                .getElements(elementName)
                .filter(element => {
                return element
                    .element(by.xpath('..'))
                    .getText()
                    .then(text => {
                    return text.trim() === desiredValue;
                });
            })
                .first()
                .isSelected()
                .then(selected => {
                if (selected) {
                    return Promise.resolve();
                }
                return Promise.reject(`Expected element ${elementName} to be selected`);
            });
        });
    }
    getPriority() {
        return 998;
    }
}
exports.checkboxHandler = new CheckboxHandler();
