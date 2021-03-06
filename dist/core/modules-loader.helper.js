"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const config_helper_1 = require("./config.helper");
class ModulesLoader {
    constructor(configuration) {
        this.paths = {
            comparators: [],
            dictionaries: [],
            form_handlers: [],
            generators: [],
            matchers: [],
            regexes: [],
            transformers: [],
            emails: [],
            hooks: [],
        };
        Object.keys(this.paths).forEach(group => {
            if (typeof config_helper_1.default[group] !== 'undefined') {
                configuration[group].forEach(groupPath => {
                    this.paths[group].push(path.join(configuration.projectPath + groupPath));
                });
            }
        });
    }
    getModules(group) {
        return this.getFilePaths(this.paths[group]).map(file => require(file[1]));
    }
    getModulesAsObject(projectFolders) {
        const modules = {};
        const filePaths = this.getFilePaths(projectFolders);
        filePaths.forEach(file => {
            modules[file[0]] = require(file[1]);
        });
        return modules;
    }
    getFilePaths(folders) {
        let files = [];
        folders.forEach(folder => {
            if (fs.existsSync(folder)) {
                files = files.concat(fs
                    .readdirSync(folder)
                    .filter(file => file !== '.gitkeep' && file.indexOf('.spec.js') < 0)
                    .map(file => [file.substr(0, file.indexOf('.')), `${folder}/${file}`]));
            }
            else {
                console.log(`Directory ${folder} does not exist.`);
            }
        });
        return files;
    }
}
exports.create = (configuration = config_helper_1.default) => new ModulesLoader(configuration);
