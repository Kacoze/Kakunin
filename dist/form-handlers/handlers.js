"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formHandler = require("./handler");
class FormHandlers {
    constructor(availableHandlers = [
        formHandler.checkboxHandler,
        formHandler.ckEditorHandler,
        formHandler.customAngularSelectHandler,
        formHandler.defaultHandler,
        formHandler.fileHandler,
        formHandler.radioHandler,
        formHandler.selectHandler,
        formHandler.uploadedFileHandler,
    ]) {
        this.availableHandlers = availableHandlers;
    }
    addHandler(handler) {
        this.availableHandlers.push(handler);
    }
    async handleFill(page, elementName, desiredValue) {
        const handlers = this.getHandlers();
        for (const handler of handlers) {
            const isSatisfied = await handler.isSatisfiedBy(page.getElement(elementName), elementName);
            if (isSatisfied) {
                return handler.handleFill(page, elementName, desiredValue);
            }
        }
        return Promise.reject('Could not find matching handler.');
    }
    async handleCheck(page, elementName, desiredValue) {
        const handlers = this.getHandlers();
        for (const handler of handlers) {
            const isSatisfied = await handler.isSatisfiedBy(page.getElement(elementName), elementName);
            if (isSatisfied) {
                return handler.handleCheck(page, elementName, desiredValue);
            }
        }
        return Promise.reject('Could not find matching handler.');
    }
    getHandlers() {
        return this.availableHandlers.sort((handler, otherHandler) => handler.getPriority() - otherHandler.getPriority());
    }
}
exports.default = new FormHandlers();
