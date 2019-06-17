"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_helper_1 = require("../core/config.helper");
const wait_for_condition_helper_1 = require("../web/cucumber/wait-for-condition.helper");
const url_parser_helper_1 = require("../web/url-parser.helper");
const querystring_1 = require("querystring");
const protractor_1 = require("protractor");
class Page {
    visit() {
        if (config_helper_1.default.type === 'otherWeb' || !url_parser_helper_1.isRelativePage(this.url)) {
            protractor.browser.ignoreSynchronization = true;
            return protractor.browser.get(this.url);
        }
        return protractor.browser.get(this.url).then(() => protractor.browser.waitForAngular());
    }
    visitWithParameters(data) {
        const additionalParams = [];
        const url = data.raw().reduce((prev, item) => {
            if (prev.indexOf(`:${item[0]}`) === -1) {
                additionalParams[item[0]] = item[1];
                return prev;
            }
            return prev.replace(`:${item[0]}`, item[1]);
        }, this.url) + (Object.entries(additionalParams).length > 0 ? '?' + querystring_1.stringify(additionalParams) : '');
        if (config_helper_1.default.type === 'otherWeb' || !url_parser_helper_1.isRelativePage(url)) {
            protractor.browser.ignoreSynchronization = true;
            return protractor.browser.get(url);
        }
        return protractor.browser.get(url).then(() => protractor.browser.waitForAngular());
    }
    async isOn() {
        if (url_parser_helper_1.isRelativePage(this.url) && config_helper_1.default.type !== 'otherWeb') {
            protractor.browser.ignoreSynchronization = false;
        }
        return browser.wait(async () => {
            const currentUrl = await browser.getCurrentUrl().then(url => url);
            return url_parser_helper_1.waitForUrlChangeTo(this.url, currentUrl)(config_helper_1.default.baseUrl);
        }, config_helper_1.default.waitForPageTimeout * 1000);
    }
    click(elementName) {
        return this.getElement(elementName).click();
    }
    isDisabled(elementName) {
        return this.getElement(elementName)
            .getAttribute('disabled')
            .then(disabled => ['disabled', true, 'true'].indexOf(disabled) !== -1);
    }
    isVisible(elementName) {
        return this.getElement(elementName).isDisplayed();
    }
    isPresent(elementName) {
        return this.getElement(elementName).isPresent();
    }
    getNumberOfElements(elementName) {
        return this.getElements(elementName).count();
    }
    scrollIntoElement(elementName, elementIndex) {
        if (elementIndex !== undefined) {
            return browser.executeScript('arguments[0].scrollIntoView(false);', this.getElement(elementName)
                .get(elementIndex)
                .getWebElement());
        }
        return browser.executeScript('arguments[0].scrollIntoView(false);', this.getElement(elementName).getWebElement());
    }
    waitForVisibilityOf(elementName) {
        return wait_for_condition_helper_1.waitForVisibilityOf(this.getElement(elementName));
    }
    waitForInvisibilityOf(elementName) {
        return wait_for_condition_helper_1.waitForInvisibilityOf(this.getElement(elementName));
    }
    getElement(elementName) {
        if (!this[elementName]) {
            return protractor_1.element(by.css(elementName));
        }
        return this[elementName];
    }
    getElements(elementName) {
        if (!this[elementName]) {
            return protractor_1.element.all(by.css(elementName));
        }
        return this[elementName];
    }
}
exports.default = Page;
