"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandArgs = require('minimist')(process.argv.slice(2));
let config;
try {
    if (process.env.NODE_ENV === 'test') {
        config = {
            projectPath: process.cwd(),
            email: {
                config: {},
            },
        };
    }
    else {
        const configFile = process.argv.find(name => name.indexOf('--config') >= 0);
        const configFilePath = configFile.substr(configFile.indexOf('=') + 1);
        const project = process.argv.find(name => name.indexOf('--projectPath') >= 0);
        const projectPath = project.substr(project.indexOf('=') + 1);
        config = require(configFilePath);
        config.projectPath = projectPath;
        config.performance = commandArgs.performance || false;
    }
}
catch (error) {
    console.log(error);
}
config = global.config || config;
global.config = config;
exports.default = config;
