"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const xlsx = require("node-xlsx");
const path = require("path");
const config_helper_1 = require("../../core/config.helper");
const FileManager = {
    wasDownloaded(expectedFileName) {
        return browser.driver.wait(() => {
            return fs.existsSync(path.join(config_helper_1.default.projectPath, config_helper_1.default.downloads, expectedFileName));
        }, config_helper_1.default.downloadTimeout * 1000);
    },
    parseXLS(expectedFileName) {
        return xlsx.parse(path.join(config_helper_1.default.projectPath, config_helper_1.default.downloads, expectedFileName))[0].data;
    },
};
exports.default = FileManager;
