"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const user_provider_helper_1 = require("../../user-provider.helper");
const variable_store_helper_1 = require("../../variable-store.helper");
class ClearVariablesHook {
    initializeHook() {
        cucumber_1.Before(function (scenario, callback) {
            this.currentUser = null;
            if (typeof this.userProvider === 'undefined') {
                this.userProvider = user_provider_helper_1.default;
            }
            variable_store_helper_1.default.clearVariables();
            callback();
        });
    }
    getPriority() {
        return 1;
    }
}
exports.clearVariablesHook = new ClearVariablesHook();
