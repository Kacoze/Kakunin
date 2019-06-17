"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const fs = require("fs");
const path = require("path");
const config_helper_1 = require("../../../core/config.helper");
const clearDownload = callback => {
    const files = fs.readdirSync(path.join(config_helper_1.default.projectPath, config_helper_1.default.downloads)).filter(file => file !== '.gitkeep');
    for (const file of files) {
        fs.unlinkSync(path.join(config_helper_1.default.projectPath, config_helper_1.default.downloads, file));
    }
    callback();
};
class ClearDownloadHook {
    initializeHook() {
        cucumber_1.Before('@downloadClearBefore', (scenario, callback) => {
            clearDownload(callback);
        });
        cucumber_1.After('@downloadClearAfter', (scenario, callback) => {
            clearDownload(callback);
        });
    }
    getPriority() {
        return 1;
    }
}
exports.clearDownloadHook = new ClearDownloadHook();
