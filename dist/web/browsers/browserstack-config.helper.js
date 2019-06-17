"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browserstack = require("browserstack-local");
const chalk_1 = require("chalk");
const shell = require("shelljs");
const config_helper_1 = require("../../core/config.helper");
exports.disconnectBrowserstack = (browserstackEnabled) => {
    if (browserstackEnabled && config_helper_1.default.browserstack) {
        const browserstackPid = shell.exec(`lsof -t -i :${config_helper_1.default.browserstack.defaultPort}`).stdout;
        if (browserstackPid.length > 0) {
            return shell.exec(`kill -9 ${browserstackPid}`);
        }
    }
    return Promise.resolve();
};
exports.connectBrowserstack = (browserstackKey) => {
    console.log(chalk_1.default.black.bgYellow('Keep in mind that Browserstack capabilities cannot be used with the local. Check the documentation for more information!'));
    exports.disconnectBrowserstack(true);
    return new Promise((resolve, reject) => {
        const bsLocal = new browserstack.Local();
        bsLocal.start({ key: browserstackKey }, error => {
            if (error) {
                return reject(error);
            }
            console.log('Connected to the Browsertack Selenium server! Now testing...');
            resolve();
        });
    });
};
