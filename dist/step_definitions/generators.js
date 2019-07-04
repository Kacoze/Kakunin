"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const transformers_1 = require("../transformers");
const variable_store_helper_1 = require("../web/variable-store.helper");
cucumber_1.When(/^I generate random "([^"]*)" as "([^"]*)"$/, (generator, variableName) => {
    return transformers_1.transformers.transform(`g:${generator}`).then(result => variable_store_helper_1.default.storeVariable(variableName, result));
});
