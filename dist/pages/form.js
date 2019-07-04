"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_handlers_1 = require("../form-handlers");
const transformers_1 = require("../transformers");
const base_1 = require("./base");
class FormPage extends base_1.default {
    async fillForm(formData) {
        for (const item of formData) {
            await this.fillField(item[0], item[1]);
        }
        return Promise.resolve();
    }
    async checkForm(formData) {
        for (const item of formData) {
            await this.checkField(item[0], item[1]);
        }
        return Promise.resolve();
    }
    fillField(name, value) {
        return form_handlers_1.fromHandlers.handleFill(this, name, transformers_1.transformers.transform(value));
    }
    checkField(name, value) {
        return form_handlers_1.fromHandlers.handleCheck(this, name, transformers_1.transformers.transform(value));
    }
}
exports.default = FormPage;
