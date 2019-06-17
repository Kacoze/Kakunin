"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const shell = require("shelljs");
exports.safariBrowserConfigurator = config => {
    shell.exec(`defaults write -app Safari DownloadsPath ${path.join(config.projectPath, config.downloads)}`);
};
