"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const config_helper_1 = require("../../core/config.helper");
class FileHandler {
    isSatisfiedBy(element) {
        return element.getTagName().then(tagName => {
            if (tagName === 'input') {
                return element.getAttribute('type').then(inputType => inputType === 'file');
            }
            if (tagName instanceof Array) {
                return element
                    .first()
                    .getAttribute('type')
                    .then(inputType => inputType === 'file');
            }
            return false;
        });
    }
    handleFill(page, elementName, desiredValue) {
        const fileToUpload = path.resolve(path.join(config_helper_1.default.projectPath, config_helper_1.default.data, desiredValue));
        return page.getElements(elementName).sendKeys(fileToUpload);
    }
    handleCheck(page, elementName, desiredValue) {
        return page
            .getElements(elementName)
            .getText()
            .then(text => {
            if (text === desiredValue) {
                return Promise.resolve();
            }
            return Promise.reject(`Expected ${desiredValue} got ${text} for file element ${elementName}`);
        });
    }
    getPriority() {
        return 998;
    }
}
exports.fileHandler = new FileHandler();
