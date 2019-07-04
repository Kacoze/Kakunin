#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const os = require("os");
const childProcess = require("child_process");
const envfile = require("node-env-file");
const cli_helper_1 = require("./core/cli/cli.helper");
const initializer_1 = require("./core/cli/initializer");
const commandArgs = require('minimist')(process.argv.slice(2));
console.log(process.cwd());
envfile(process.cwd() + '/.env', { raise: false, overwrite: false });
if (cli_helper_1.isInitCommand(process.argv)) {
    (async () => {
        await initializer_1.default.initConfig(commandArgs);
        await initializer_1.default.generateProjectStructure();
    })();
}
else {
    const optionsToFilter = ['config', 'projectPath', 'disableChecks', 'tags'];
    const argv = [
        './node_modules/kakunin/dist/protractor.conf.js',
        `--config=${process.cwd()}/kakunin.conf.js`,
        `--projectPath=${process.cwd()}`,
        '--disableChecks',
        ...cli_helper_1.createTagsCLIArgument(commandArgs),
        ...cli_helper_1.filterCLIArguments(optionsToFilter)(commandArgs),
    ];
    const protractorExecutable = os.platform() === 'win32' ? 'protractor.cmd' : 'protractor';
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules', 'protractor', 'node_modules', 'webdriver-manager', 'selenium', 'update-config.json'))) {
        childProcess.execSync(path.join(process.cwd(), 'node_modules', '.bin', 'webdriver-manager update --ie --versions.standalone=3.14.0'));
    }
    childProcess
        .spawn(path.join('node_modules', '.bin', protractorExecutable), argv, {
        stdio: 'inherit',
        cwd: process.cwd(),
    })
        .once('exit', code => {
        console.log('Protractor has finished');
        process.exit(code);
    });
}
