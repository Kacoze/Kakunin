"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.prepareBrowserInstance = (browserConfig, specs) => {
    const instance = _.cloneDeep(browserConfig);
    instance.specs = specs;
    return instance;
};
