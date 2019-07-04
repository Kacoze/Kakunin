"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variable_store_helper_1 = require("../../web/variable-store.helper");
class VariableStoreTransformer {
    constructor(variableStore) {
        this.variableStore = variableStore;
    }
    isSatisfiedBy(prefix) {
        return prefix === 'v:';
    }
    transform(value) {
        return this.variableStore.getVariableValue(value);
    }
}
exports.createVariableStoreTransformer = (variableStore = variable_store_helper_1.default) => new VariableStoreTransformer(variableStore);
