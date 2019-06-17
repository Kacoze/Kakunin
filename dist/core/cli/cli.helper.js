"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.isInitCommand = (args) => {
    if (Array.isArray(args)) {
        return args.length > 2 && args[2] === 'init';
    }
    return false;
};
exports.getConfigPath = (configFile, argsConfig, basePath) => {
    return argsConfig ? path.join(basePath, argsConfig) : path.join(basePath, configFile);
};
exports.createTagsCLIArgument = commandArgs => {
    const tags = [];
    if (commandArgs.performance) {
        if (commandArgs.tags !== undefined && commandArgs.tags.indexOf('@performance') < 0) {
            tags.push('--cucumberOpts.tags');
            tags.push(`${commandArgs.tags} and @performance`);
        }
        else if (commandArgs.tags === undefined) {
            tags.push('--cucumberOpts.tags');
            tags.push('@performance');
        }
        else {
            tags.push('--cucumberOpts.tags');
            tags.push(commandArgs.tags);
        }
    }
    else if (commandArgs.tags !== undefined) {
        tags.push('--cucumberOpts.tags');
        tags.push(commandArgs.tags);
    }
    return tags;
};
exports.filterCLIArguments = blackList => commandArgs => {
    const commandLineArgs = [];
    for (const prop in commandArgs) {
        if (prop !== '_' && !blackList.includes(prop)) {
            if (commandArgs[prop] === true || commandArgs[prop] === false) {
                commandLineArgs.push(`--${prop}`);
            }
            else {
                commandLineArgs.push(`--${prop}=${commandArgs[prop]}`);
            }
        }
    }
    return commandLineArgs;
};
