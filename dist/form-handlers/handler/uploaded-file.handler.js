"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UploadedFileHandler {
    isSatisfiedBy(element, elementName) {
        return Promise.resolve(elementName.endsWith('Uploaded'));
    }
    handleFill(page, elementName, desiredValue) {
        return Promise.reject('Not supported for this field type');
    }
    handleCheck(page, elementName, desiredValue) {
        return page[elementName].getText().then(text => {
            if (text.indexOf(desiredValue) >= 0) {
                return Promise.resolve();
            }
            return Promise.reject(`Expected ${desiredValue} got ${text} for file element ${elementName}`);
        });
    }
    getPriority() {
        return 998;
    }
}
exports.uploadedFileHandler = new UploadedFileHandler();
