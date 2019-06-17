"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
cucumber_1.When(/^I switch to window number "([^"]*)" of a browser$/, tabNumber => {
    return browser.getAllWindowHandles().then(handles => browser.switchTo().window(handles[tabNumber - 1]));
});
cucumber_1.When(/^I close the current browser tab$/, () => {
    return browser
        .close()
        .then(() => browser.getAllWindowHandles())
        .then(tabs => browser.switchTo().window(tabs[0]));
});
