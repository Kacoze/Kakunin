"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
cucumber_1.Given(/^I visit the "([^"]*)" page$/, function (pageName) {
    expect(browser.page[pageName]).toBeDefined();
    this.currentPage = browser.page[pageName];
    return this.currentPage.visit();
});
cucumber_1.Given(/^I visit the "([^"]*)" page with parameters:$/, function (pageName, data) {
    expect(browser.page[pageName]).toBeDefined();
    this.currentPage = browser.page[pageName];
    return this.currentPage.visitWithParameters(data);
});
cucumber_1.Then(/^the "([^"]*)" page is displayed$/, function (pageName) {
    const self = this;
    return browser.page[pageName].isOn().then(checkResult => {
        if (typeof checkResult !== 'object') {
            return Promise.reject('Check result must be an object!!!');
        }
        self.currentPage = browser.page[pageName];
        self.urlParameters = checkResult.parameters;
    });
});
