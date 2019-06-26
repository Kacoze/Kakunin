"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandArgs = require('minimist')(process.argv.slice(2));
let config = require(`${process.cwd()}/kakunin.conf.js`);
console.log(process.cwd());
config = {
    projectPath: process.cwd(),
    email: {
        config: {},
    },
};
config.projectPath = process.cwd();
config.performance = commandArgs.performance || false;
exports.default = config;
