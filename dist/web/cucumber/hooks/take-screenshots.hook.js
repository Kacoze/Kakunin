"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_helper_1 = require("../../../core/config.helper");
const cucumber_1 = require("cucumber");
const takeScreenshot = scenario => {
    return browser.takeScreenshot().then(base64png => {
        scenario.attach(new Buffer(base64png, 'base64'), 'image/png');
        return Promise.resolve();
    }, () => Promise.resolve());
};
const clearCookiesAndLocalStorage = callback => {
    let cookiesFunc = () => Promise.resolve(true);
    if (config_helper_1.default.clearCookiesAfterScenario) {
        cookiesFunc = () => protractor.browser.manage().deleteAllCookies();
    }
    let localStorageFunc = () => Promise.resolve(true);
    if (config_helper_1.default.clearLocalStorageAfterScenario) {
        localStorageFunc = () => protractor.browser.executeScript('window.localStorage.clear();');
    }
    browser
        .wait(cookiesFunc()
        .then(localStorageFunc)
        .catch(() => false), config_helper_1.default.waitForPageTimeout * 1000)
        .then(() => {
        protractor.browser.ignoreSynchronization = config_helper_1.default.type === 'otherWeb';
        callback();
    });
};
class TakeScreenshotHook {
    initializeHook() {
        return cucumber_1.After(function (scenario, callback) {
            if (scenario.result.status !== 'passed') {
                takeScreenshot(this).then(() => {
                    clearCookiesAndLocalStorage(callback);
                });
            }
            else {
                clearCookiesAndLocalStorage(callback);
            }
        });
    }
    getPriority() {
        return 1;
    }
}
exports.takeScreenshotHook = new TakeScreenshotHook();
