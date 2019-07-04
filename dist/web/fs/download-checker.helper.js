"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const config_helper_1 = require("../../core/config.helper");
const DownloadChecker = {
    wasDownloaded(expectedFileName) {
        return browser.driver.wait(() => {
            return fs.existsSync(path.join(config_helper_1.default.projectPath, config_helper_1.default.downloads, expectedFileName));
        }, config_helper_1.default.downloadTimeout * 1000);
    },
};
exports.default = DownloadChecker;
