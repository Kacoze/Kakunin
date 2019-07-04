"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
cucumber_1.Then(/^I wait for "([^"]*)" seconds$/, seconds => {
    return browser.sleep(Number(seconds) * 1000);
});
