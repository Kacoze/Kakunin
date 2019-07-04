"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.deleteReports = directory => {
    return fs
        .readdirSync(directory)
        .filter(file => fs.statSync(path.join(directory, file)).isFile() && file !== '.gitkeep')
        .forEach(file => fs.unlinkSync(path.join(directory, file)));
};
