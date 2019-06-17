"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdirp = require("mkdirp");
exports.prepareCatalogs = directory => {
    if (fs.existsSync(directory)) {
        return Promise.resolve();
    }
    mkdirp(directory, null);
    console.log(`${directory} has been added!`);
    fs.writeFileSync(`${directory}/.gitkeep`, '');
};
