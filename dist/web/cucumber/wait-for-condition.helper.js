"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_helper_1 = require("../../core/config.helper");
const globalTimeout = parseInt(config_helper_1.default.elementsVisibilityTimeout) * 1000;
exports.waitForCondition = (condition, timeout) => {
    return element => {
        if (element instanceof protractor.ElementArrayFinder) {
            return browser.wait(protractor.ExpectedConditions[condition](element.first()), timeout);
        }
        return browser.wait(protractor.ExpectedConditions[condition](element), timeout);
    };
};
exports.waitForVisibilityOf = element => {
    return exports.waitForCondition('visibilityOf', globalTimeout)(element);
};
exports.waitForInvisibilityOf = element => {
    return exports.waitForCondition('invisibilityOf', globalTimeout)(element);
};
